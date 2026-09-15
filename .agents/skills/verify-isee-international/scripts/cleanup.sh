#!/usr/bin/env bash
# Tear down only the instance this run started.
#
# Never kills by process name: this repo's worktrees each run their own vite.
# The cwd check before killing a foreign listener is the safety net.
set -uo pipefail

PORT="${PORT:-8199}"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../../apps/isee-international" && pwd)"
RUN_ID="${RUN_ID:-latest}"
RUN_DIR="${RUN_DIR:-$(cd "$APP_DIR/../.." && pwd)/.verify-isee-international/$RUN_ID}"

if [ -f "$RUN_DIR/vite.pid" ]; then
  pid="$(cat "$RUN_DIR/vite.pid")"
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" 2>/dev/null
    for _ in $(seq 1 20); do
      kill -0 "$pid" 2>/dev/null || break
      sleep 0.5
    done
    if kill -0 "$pid" 2>/dev/null; then
      echo "pid $pid ignored SIGTERM, sending SIGKILL"
      kill -9 "$pid" 2>/dev/null
      sleep 1
    fi
    echo "stopped dev server pid $pid"
  else
    echo "dev server pid $pid was already gone"
  fi
  rm -f "$RUN_DIR/vite.pid"
else
  echo "no recorded pid in $RUN_DIR"
fi

# A vite child can outlive its parent; only reclaim the port if it is ours.
for pid in $(lsof -nP -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true); do
  cwd="$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')"
  if [ "$cwd" = "$APP_DIR" ]; then
    echo "reclaiming port $PORT from pid $pid (cwd $cwd)"
    kill "$pid" 2>/dev/null
    sleep 1
    kill -0 "$pid" 2>/dev/null && kill -9 "$pid" 2>/dev/null
  else
    echo "leaving pid $pid alone: cwd is '$cwd', not this App"
  fi
done

sleep 1
if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "FAIL: port $PORT is still held:" >&2
  lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >&2
  exit 1
fi

echo "port $PORT free"
echo "evidence preserved at $RUN_DIR"
