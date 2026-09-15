#!/usr/bin/env bash
# Copy Workspace root to the container host. Do not copy Mac node_modules or .next —
# sharp and other native addons must be built on Debian.
#
# The remote image has no rsync binary. Open rsync on macOS still execs
# `rsync` on the far side, so we tar over ssh instead.
set -euo pipefail

HOST="${VPS_HOST:-root@47.88.52.10}"
PORT="${VPS_PORT:-2222}"
DEST="${VPS_DIR:-/var/www/isee-website}"
# Script is apps/isee-china/scripts/; Workspace root is three levels up.
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"

ssh -p "$PORT" "$HOST" "mkdir -p '$DEST'"

COPYFILE_DISABLE=1 tar -C "$ROOT" \
  --exclude=node_modules \
  --exclude='*/node_modules' \
  --exclude=.next \
  --exclude='*/.next' \
  --exclude=.git \
  --exclude=.scratch \
  --exclude=.pi \
  --exclude=.tmpwb \
  --exclude=.env \
  --exclude=.env.* \
  --exclude=tsconfig.tsbuildinfo \
  --exclude=.DS_Store \
  -cf - . |
  ssh -p "$PORT" "$HOST" "tar -C '$DEST' -xf -"

echo "synced ${ROOT} -> ${HOST}:${DEST}"
echo "on the server: cd ${DEST} && pnpm install --frozen-lockfile && pnpm build:isee-china"
echo "then: nohup pnpm start:vps:isee-china > /var/log/isee-website.log 2>&1 &"
