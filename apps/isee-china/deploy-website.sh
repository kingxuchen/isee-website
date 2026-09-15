#!/bin/bash
# ============================================================
# 部署 isee-website 到远程服务器（Debian + Docker）
#
# 流程：SSH 免密（首次用密码装密钥）→ 同步源码到 /data/isee-website
#       → 服务器端多阶段构建镜像 → 重建容器 → 健康检查
#
# 用法：
#   ISEE_DEPLOY_PASS='密码' ./deploy-website.sh   # 密码走环境变量（仅首次需要）
#   ./deploy-website.sh                           # 交互输入密码（仅首次需要）
#
# 可选覆盖（环境变量）：
#   SERVER_HOST / SERVER_USER / HOST_PORT / DOCKER_NETWORK
# ============================================================

set -euo pipefail

SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-192.168.229.50}"
REMOTE_DIR="${REMOTE_DIR:-/data/isee-website}"
CONTAINER="${CONTAINER:-isee-website}"
IMAGE="${IMAGE:-isee-china:latest}"
# 宿主机端口：仅绑回环，给下面的健康检查用。对外访问统一走 isee-nginx
# （仓库副本 deploy/prod/nginx.conf，线上在 /opt/isee/nginx/nginx.conf）。
# nginx 在同网络内用容器名 isee-website:3000 反代，不依赖这个宿主机端口。
# 绑 127.0.0.1 而不是 0.0.0.0，避免官网绕过 nginx 被直接访问。
# ⚠ 现存线上容器是 2026-09-03 之前用更早的版本建的，当时是 0.0.0.0:3001；
#   跑本脚本重建后会收紧成 127.0.0.1:3001，内网其他机器将不能再直连 3001
#   （对外无影响，入口一直是 nginx 的 80 / 8080）。
HOST_PORT="${HOST_PORT:-3001}"
# 与 isee-nginx / isee-server 同网络，nginx 用容器名反代官网
DOCKER_NETWORK="${DOCKER_NETWORK:-isee_default}"
# 重建容器后需要经它验证入口（见 verify_via_nginx 的注释）
NGINX_CONTAINER="${NGINX_CONTAINER:-isee-nginx}"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# Script lives at apps/isee-china/; Workspace root is two levels up.
WORKSPACE_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SSH_DEST="$SERVER_USER@$SERVER_HOST"

echo "=========================================="
echo "  isee-website 部署（App: isee-china）"
echo "  服务器: $SSH_DEST"
echo "  目录:   $REMOTE_DIR"
echo "  镜像:   $IMAGE"
echo "  端口:   127.0.0.1:$HOST_PORT -> 3000（仅健康检查，对外走 nginx）"
echo "=========================================="

# ---------- 1. SSH 免密：优先密钥，否则用密码一次性安装密钥 ----------
ssh_ok() {
    ssh -o BatchMode=yes -o ConnectTimeout=8 "$SSH_DEST" "true" 2>/dev/null
}

ensure_ssh_key() {
    if ssh_ok; then
        log "SSH 密钥免密已就绪"
        return
    fi

    local pass="${ISEE_DEPLOY_PASS:-}"
    if [ -z "$pass" ]; then
        read -s -r -p "请输入 $SSH_DEST 的密码（仅首次，用于安装 SSH 密钥）: " pass
        echo
    fi
    [ -n "$pass" ] || err "未提供密码（ISEE_DEPLOY_PASS 或交互输入）"

    if [ ! -f "$HOME/.ssh/id_ed25519" ]; then
        log "生成本地 SSH 密钥..."
        ssh-keygen -t ed25519 -N "" -f "$HOME/.ssh/id_ed25519" -q
    fi

    log "安装 SSH 密钥到服务器（一次性）..."
    ISEE_TMP_PASS="$pass" SSH_DEST_VAL="$SSH_DEST" expect -c '
set timeout 30
spawn ssh-copy-id -o StrictHostKeyChecking=no $env(SSH_DEST_VAL)
expect "password:" { send "$env(ISEE_TMP_PASS)\r" }
expect eof
'
    ssh_ok || err "SSH 密钥安装失败，请检查密码/网络"
    log "SSH 密钥免密配置完成"
}

# ---------- 2. 同步源码 ----------
sync_source() {
    log "同步 Workspace root 到 $SSH_DEST:$REMOTE_DIR/app ..."
    ssh "$SSH_DEST" "mkdir -p $REMOTE_DIR/app"
    rsync -az --delete \
        --exclude '.git' \
        --exclude '.scratch' \
        --exclude '**/.next' \
        --exclude '**/out' \
        --exclude '**/node_modules' \
        --exclude '.pi' \
        --exclude '.tmp*' \
        --exclude '.env' \
        --exclude '.env.*' \
        --exclude '*.tsbuildinfo' \
        --exclude '.DS_Store' \
        --exclude 'apps/isee-china/deploy' \
        --exclude 'apps/isee-china/docs' \
        "$WORKSPACE_ROOT/" "$SSH_DEST:$REMOTE_DIR/app/"
    log "源码同步完成"
}

# ---------- 3. 构建镜像 ----------
build_image() {
    log "服务器端构建镜像（首次需下载依赖，可能几分钟）..."
    # pipefail 保证 tail 不吞掉 docker build 的失败退出码
    ssh "$SSH_DEST" "set -o pipefail; cd $REMOTE_DIR/app && docker build -f apps/isee-china/Dockerfile -t $IMAGE . 2>&1 | tail -20" \
        || err "镜像构建失败，见上方日志"
    # 清理历史悬空镜像，避免磁盘膨胀
    ssh "$SSH_DEST" "docker image prune -f >/dev/null 2>&1 || true"
    log "镜像构建完成"
}

# ---------- 4. 重建容器 ----------
recreate_container() {
    log "重建容器..."
    ssh "$SSH_DEST" "docker rm -f $CONTAINER 2>/dev/null || true"
    # 一次到位：建容器时就挂进 isee_default。原来是不带 --network 先建、再补
    # docker network connect，中间有几秒该容器不在这个网络上，nginx 按容器名反代
    # 会解析不到，官网瞬时 502 —— 对把 nginx 当唯一入口的服务不该有这个窗口。
    ssh "$SSH_DEST" "docker run -d \
        --name $CONTAINER \
        --restart unless-stopped \
        --network $DOCKER_NETWORK \
        -p 127.0.0.1:$HOST_PORT:3000 \
        $IMAGE" >/dev/null
    log "容器已启动（已在 $DOCKER_NETWORK 上）"
}

# ---------- 5. 健康检查 ----------
health_check() {
    log "等待服务启动..."
    for i in $(seq 1 30); do
        local code
        code=$(ssh "$SSH_DEST" "curl -s -o /dev/null -w '%{http_code}' --max-time 3 http://127.0.0.1:$HOST_PORT/" 2>/dev/null || echo 000)
        if [ "$code" = "200" ]; then
            log "服务启动成功（HTTP ${code}）"
            return 0
        fi
        # 容器已退出则直接失败
        local state
        state=$(ssh "$SSH_DEST" "docker inspect -f '{{.State.Status}}' $CONTAINER" 2>/dev/null || echo unknown)
        if [ "$state" = "exited" ]; then
            ssh "$SSH_DEST" "docker logs --tail 30 $CONTAINER" || true
            err "容器启动后退出，见上方日志"
        fi
        sleep 2
    done
    ssh "$SSH_DEST" "docker logs --tail 30 $CONTAINER" || true
    err "30 次轮询未等到 HTTP 200"
}

# ---------- 6. 经 nginx 的入口验证 ----------
# 上面那步只测了 127.0.0.1:3001，那是绕过 nginx 的直连口，测不出 nginx 链路。
# nginx 对 upstream 里的容器名只在配置加载时解析一次并缓存 IP，而重建容器可能换 IP；
# 一换，nginx 还往旧 IP 打，官网直接 502，而直连口依然是 200 —— 就是“脚本报成功、
# 线上其实挂了”。所以必须经 nginx 再测一遍；失败就 reload 让它重新解析（自愈）。
verify_via_nginx() {
    log "经 nginx 验证入口..."
    local code
    code=$(ssh "$SSH_DEST" "curl -s -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1/" 2>/dev/null || echo 000)
    if [ "$code" = "200" ]; then
        log "nginx 入口正常（HTTP ${code}）"
        return 0
    fi

    warn "经 nginx 得到 ${code}，十有八九是 upstream 缓存的容器 IP 已失效，reload nginx 重新解析..."
    ssh "$SSH_DEST" "docker exec $NGINX_CONTAINER nginx -t && docker exec $NGINX_CONTAINER nginx -s reload" \
        || warn "nginx reload 失败，继续重试探测"
    sleep 2
    code=$(ssh "$SSH_DEST" "curl -s -o /dev/null -w '%{http_code}' --max-time 5 http://127.0.0.1/" 2>/dev/null || echo 000)
    if [ "$code" = "200" ]; then
        log "reload 后 nginx 入口已恢复（HTTP ${code}）"
        return 0
    fi
    err "经 nginx 仍是 ${code}：直连 ${HOST_PORT} 是通的，说明站点本身没挂，是 nginx 这一环断了。手工查：ssh $SSH_DEST 'docker logs --tail 50 $NGINX_CONTAINER'"
}

ensure_ssh_key
sync_source
build_image
recreate_container
health_check
verify_via_nginx

echo
log "部署完成 🎉"
echo "  本机自检: ssh $SSH_DEST 'curl -sI http://127.0.0.1:$HOST_PORT/'"
echo "  内网入口: http://$SERVER_HOST/            （nginx :80）"
echo "  公网入口: http://47.99.95.103:8080/       （nginx :8080）"
echo "  查看日志: ssh $SSH_DEST 'docker logs -f $CONTAINER'"
