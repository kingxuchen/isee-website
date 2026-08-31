# Deploy isee-website on the Debian VPS

Public traffic: `http://47.88.52.10:8080` → nginx → `127.0.0.1:3000` → `next start`.

This is the production path. Cloudflare Workers / OpenNext is not in the repo.

Do **not** rsync a Mac `.next` or `node_modules`. `next/image` needs Linux `sharp`.

SSH (you run this, not the agent):

```bash
ssh -p 2222 root@47.88.52.10
```

From your Mac, the same host is the rsync target.

---

## 1. Look at what is already listening

Run this **after** `ssh -p 2222 root@47.88.52.10`. Prompt should look like `root@...` / bash, not your Mac `zsh`.

If `echo $HOST` is your laptop hostname, you are still local. `ss: command not found` on a Mac is the same signal.

On the VPS:

```bash
hostname -f; cat /etc/os-release | head -3
which nginx; nginx -v
ls -la /etc/nginx
ls -la /etc/nginx/sites-enabled /etc/nginx/sites-available /etc/nginx/conf.d 2>/dev/null || true
(command -v ss >/dev/null && ss -lntp || netstat -lntp) | grep -E ':8080|:80 |:443|:3000' || true
nginx -T 2>/dev/null | grep -nE 'listen |server_name |root |proxy_pass|include '
node -v; command -v pnpm; pnpm -v
```

If something other than this site already owns 8080, stop and reuse that `server { }` instead of enabling a second one.

**Probed on this VPS (Debian 12, nginx 1.22.1, hostname `0e952992201b`):**

- `/etc/nginx/sites-enabled` is empty. Nothing currently listens on 8080.
- `/etc/nginx/sites-available/default` exists but is **not** enabled. Leave it.
- `/etc/nginx/conf.d/redirect80.conf` already `listen 80`. Do not edit or replace it; our site only uses 8080.
- Enable `deploy/nginx/isee-website.conf` into `sites-enabled`. No second `listen 8080` to fight with.
- Hostname looks like a container id. Before systemd, check PID 1 (see below). If there is no systemd, keep Next in the foreground only for smoke-test, then use whatever supervisor this box already has.

`/etc/nginx/nginx.conf` is the **master** config. Leave it alone. Debian's copy includes:

```nginx
include /etc/nginx/conf.d/*.conf;
include /etc/nginx/sites-enabled/*;
```

That is the hook. Our site file goes into `sites-available` and is symlinked into `sites-enabled`. Do not paste a `server { }` into `nginx.conf` itself.

If `sites-enabled` / `conf.d` **do not exist on the VPS**, this nginx is not using the Debian layout (Docker, OpenResty, panel, or a non-system prefix). Then find the real prefix:

```bash
nginx -t
ps aux | grep -i nginx | grep -v grep
```

Create the Debian dirs only after `nginx -t` says it is reading `/etc/nginx/nginx.conf`:

```bash
mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled /etc/nginx/conf.d
```

---

## 2. Node 20+ and pnpm

Next.js 16 needs Node 20+. Debian's `apt install nodejs` is often too old. Use NodeSource Node 22, then corepack for pnpm:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs
node -v   # v22.x

corepack enable
corepack prepare pnpm@9 --activate
pnpm -v
```

Skip this stage if `node -v` is already `v20` or newer and `pnpm -v` works.

---

## 3. Copy source from your Mac

In the project root on your Mac (not on the VPS):

```bash
chmod +x scripts/rsync-to-vps.sh
./scripts/rsync-to-vps.sh
```

Override host/dir if needed:

```bash
VPS_HOST=root@47.88.52.10 VPS_PORT=2222 VPS_DIR=/var/www/isee-website ./scripts/rsync-to-vps.sh
```

---

## 4. Build and smoke-test Next on loopback

On the VPS:

```bash
cd /var/www/isee-website
pnpm install --frozen-lockfile
pnpm build
pnpm exec next start --hostname 127.0.0.1 --port 3000
```

In a second SSH session:

```bash
curl -sI http://127.0.0.1:3000/ | head
```

You want HTTP 200. Then Ctrl-C the foreground `next start` and hand it to systemd.

---

## 5. Keep Next alive after SSH disconnect

Check the supervisor first (this hostname looks like a container):

```bash
ps -p 1 -o comm=
command -v systemctl && systemctl is-system-running || true
```

If that prints `systemd` / `running`, install the unit:

```bash
cp /var/www/isee-website/deploy/systemd/isee-website.service /etc/systemd/system/isee-website.service
systemctl daemon-reload
systemctl enable --now isee-website
systemctl status isee-website --no-pager
curl -sI http://127.0.0.1:3000/ | head
```

Logs: `journalctl -u isee-website -f`

If PID 1 is `bash`, `docker-init`, or `systemctl` is missing, skip the unit. Paste that output; do not use `nohup` as the long-term plan.

---

## 6. Point the existing nginx at Next

On this box `sites-enabled` is empty and 8080 is free. Copy the site file and enable it. Do **not** touch `conf.d/redirect80.conf` (port 80).

```bash
cp /var/www/isee-website/deploy/nginx/isee-website.conf /etc/nginx/sites-available/isee-website.conf
ln -sfn /etc/nginx/sites-available/isee-website.conf /etc/nginx/sites-enabled/isee-website.conf

nginx -t
nginx -s reload || systemctl reload nginx
```

If `nginx -t` says `bind() to 0.0.0.0:8080 failed` or `duplicate listen`, another conf still has `listen 8080`. Find it with the `nginx -T` command in step 1 and disable that file.

---

## 7. Check from outside

On your Mac:

```bash
curl -sI http://47.88.52.10:8080/ | head
```

Browser: `http://47.88.52.10:8080/`

Hero / Ecosystem images should load (`next/image` via `sharp` on the VPS). If they 500, `pnpm install` likely skipped the `sharp` build — see `pnpm-workspace.yaml` `allowBuilds`.

---

## Later deploys

```bash
# Mac
./scripts/rsync-to-vps.sh

# VPS
cd /var/www/isee-website
pnpm install --frozen-lockfile
pnpm build
systemctl restart isee-website
```

---

## What this does not do

- Database. None in this app yet.
- Docker / compose.
- TLS on 80/443.
- Touch `conf.d/redirect80.conf` (port 80 belongs to that file).
