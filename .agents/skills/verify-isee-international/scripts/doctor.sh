#!/usr/bin/env bash
# Read-only health check: "is this instance worth driving?"
#
# The failure this exists to catch: a 200 from a *different* app that happens to
# hold the port. lsof's cwd check is what makes the answer trustworthy.
set -uo pipefail

PORT="${PORT:-8199}"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../../apps/isee-international" && pwd)"
RUN_ID="${RUN_ID:-latest}"
RUN_DIR="${RUN_DIR:-$(cd "$APP_DIR/../.." && pwd)/.verify-isee-international/$RUN_ID}"

fail=0
pass() { printf 'pass  %s\n' "$1"; }
bad()  { printf 'FAIL  %s\n' "$1"; fail=1; }
info() { printf 'info  %s\n' "$1"; }

echo "Instance"
if [ -f "$RUN_DIR/vite.pid" ] && kill -0 "$(cat "$RUN_DIR/vite.pid")" 2>/dev/null; then
  pass "dev server pid $(cat "$RUN_DIR/vite.pid") is alive"
else
  info "no live pid at $RUN_DIR/vite.pid (RUN_DIR=$RUN_ID)"
fi

pids="$(lsof -nP -tiTCP:"$PORT" -sTCP:LISTEN 2>/dev/null || true)"
if [ -z "$pids" ]; then
  bad "nothing listening on $PORT"
else
  pass "port $PORT has a listener (pid $pids)"
  owned=0
  for pid in $pids; do
    cwd="$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')"
    if [ "$cwd" = "$APP_DIR" ]; then
      owned=1
      pass "pid $pid cwd is $APP_DIR"
    else
      bad "pid $pid cwd is '$cwd', not $APP_DIR — another worktree's server"
    fi
  done
  [ "$owned" = 1 ] || bad "no listener on $PORT belongs to this App"
fi

echo
echo "App"
title="$(curl -fsS "http://127.0.0.1:$PORT/" 2>/dev/null | sed -n 's:.*<title[^>]*>\([^<]*\)</title>.*:\1:p' | head -1)"
if [ -n "$title" ]; then
  case "$title" in
    Isee*) pass "GET / 200, title: $title" ;;
    *)     bad "GET / 200 but title is '$title', expected it to start with Isee" ;;
  esac
else
  bad "GET http://127.0.0.1:$PORT/ returned no <title>"
fi

if [ "$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/llms.txt")" = "200" ]; then
  pass "GET /llms.txt 200"
else
  bad "GET /llms.txt did not return 200"
fi

echo
echo "Harness"
if command -v agent-browser >/dev/null 2>&1; then
  if agent-browser doctor --offline --quick >/dev/null 2>&1; then
    pass "agent-browser doctor --offline --quick"
  else
    bad "agent-browser doctor reported a problem; run it directly for detail"
  fi
else
  bad "agent-browser is not on PATH"
fi

echo
if [ "$fail" = 0 ]; then
  echo "Summary: all checks passed"
else
  echo "Summary: instance is not worth driving" >&2
fi
exit "$fail"
