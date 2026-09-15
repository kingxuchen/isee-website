#!/usr/bin/env bash
# Start the isee-international dev server for verification on a pinned port.
#
# Why pinned: vite.config.ts sets strictPort:false, so a bare `pnpm dev` drifts
# to 8083/8084 whenever another worktree holds 8082 — and this repo's worktrees
# routinely do. A drifted port makes every subsequent assertion ambiguous.
set -euo pipefail

PORT="${PORT:-8199}"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../../apps/isee-international" && pwd)"
RUN_ID="${RUN_ID:-$(date +%Y%m%d-%H%M%S)}"
VERIFY_ROOT="$(cd "$APP_DIR/../.." && pwd)/.verify-isee-international"
RUN_DIR="${RUN_DIR:-$VERIFY_ROOT/$RUN_ID}"

mkdir -p "$RUN_DIR"
# doctor.sh and cleanup.sh default to RUN_DIR=latest, so point it at this run.
ln -sfn "$RUN_DIR" "$VERIFY_ROOT/latest"

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "FAIL: port $PORT is already in use by:" >&2
  lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >&2
  echo "Refusing to double-drive an instance this run did not start." >&2
  exit 1
fi

echo "RUN_DIR=$RUN_DIR"
echo "PORT=$PORT"

# `pnpm dev -- --port N` silently ignores the extra args; go straight to vite.
cd "$APP_DIR"
nohup pnpm exec vite --port "$PORT" --strictPort >"$RUN_DIR/vite.log" 2>&1 &
echo $! >"$RUN_DIR/vite.pid"

for _ in $(seq 1 60); do
  if curl -fsS -o /dev/null "http://127.0.0.1:$PORT/llms.txt" 2>/dev/null; then
    echo "ready: http://127.0.0.1:$PORT/ (pid $(cat "$RUN_DIR/vite.pid"))"
    exit 0
  fi
  if ! kill -0 "$(cat "$RUN_DIR/vite.pid")" 2>/dev/null; then
    echo "FAIL: dev server exited. Log tail:" >&2
    tail -30 "$RUN_DIR/vite.log" >&2
    exit 1
  fi
  sleep 1
done

echo "FAIL: dev server did not answer on $PORT within 60s. Log tail:" >&2
tail -30 "$RUN_DIR/vite.log" >&2
exit 1
