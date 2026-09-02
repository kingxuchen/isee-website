# isee-website

基于 Next.js 构建的 Web 项目。

## 本地开发（Development）

安装依赖后，运行开发服务器：

```bash
# 安装依赖
pnpm install # 或 npm install

# 启动开发服务器（支持热重载）
pnpm dev     # 或 npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看页面。

---

## 生产环境编译与启动（Build & Start）

上线部署或正式运行时，需先构建生产代码与静态资源，再启动服务：

### 1. 编译构建
```bash
pnpm build # 或 npm run build
```
> 执行后会在根目录生成 `.next` 生产产物目录。

### 2. 生产启动
```bash
# 方式 1：使用 npm/pnpm 脚本启动（默认端口 3000）
pnpm start # 或 npm run start

# 方式 2：指定自定义端口（例如 8080）
pnpm start -p 8080 # 或 npm run start -- -p 8080

# 方式 3：直接使用 next 命令启动（仅监听本地回环，配合 Nginx 网关代理）
npx next start -H 127.0.0.1 -p 3000
```

---

## 生产进程守护（PM2 管理）

为了保证服务在后台持续稳定运行并在异常退出后自动重启，推荐使用 **PM2** 进行进程管理：

```bash
# 全局安装 pm2（若未安装）
npm install -g pm2

# 启动服务并命名为 isee-website
pm2 start npm --name "isee-website" -- run start

# 或者直接用 npx next start 启动指定端口
pm2 start "npx next start -p 3000" --name "isee-website"

# 常用运维命令
pm2 list                  # 查看所有进程状态
pm2 logs isee-website     # 查看实时日志
pm2 restart isee-website  # 重启服务
pm2 stop isee-website     # 停止服务
```

---

## Nginx 网关反向代理配置

本项目使用 Nginx 作为前端网关，接收外网 HTTP/HTTPS 请求并代理到本地的 Next.js 生产服务。

### 推荐 Nginx 配置示例

在 `/etc/nginx/conf.d/isee-website.conf`（或站点配置文件）中加入以下配置：

```nginx
# 1. 定义上游 Next.js 服务集群/端口
upstream nextjs_upstream {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name your-domain.com; # 替换为你的实际域名或服务器公网 IP

    # 2. 静态资源优化：对 Next.js 编译生成的静态文件开启长时间缓存
    location /_next/static/ {
        proxy_pass http://nextjs_upstream;
        proxy_cache_bypass $http_upgrade;
        expires 365d;
        access_log off;
    }

    # 3. 根路径及所有动态请求反向代理
    location / {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;

        # 支持 WebSocket 与 HTTP 流式传输（Server Components / Streaming）
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # 透传客户端真实 IP 和 Host
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 代理超时配置
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }
}
```

### 验证与重载 Nginx
```bash
# 检查 Nginx 配置文件语法是否正确
sudo nginx -t

# 平滑重新加载配置
sudo nginx -s reload
```

