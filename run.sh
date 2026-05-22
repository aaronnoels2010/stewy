#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-all}"

cleanup() {
  echo "Stopping all processes..."
  kill_pid_file "/tmp/stewy-api.pid"
  kill_pid_file "/tmp/stewy-mobile.pid"
}

kill_pid_file() {
  local pid_file="$1"
  if [[ -f "$pid_file" ]]; then
    local pid
    pid=$(cat "$pid_file")
    if kill -0 "$pid" 2>/dev/null; then
      echo "Killing process $pid ($pid_file)"
      kill "$pid" 2>/dev/null || true
    fi
    rm -f "$pid_file"
  fi
}

case "$MODE" in
  api)
    echo "Starting API..."
    cd stewy-api && ./gradlew bootRun
    ;;
  mobile)
    echo "Starting Expo dev server..."
    cd stewy-mobile && npm start
    ;;
  all)
    trap cleanup EXIT

    echo "Starting API in background..."
    cd stewy-api
    nohup ./gradlew bootRun > /tmp/stewy-api.log 2>&1 &
    echo $! > /tmp/stewy-api.pid
    cd ..

    echo "Starting Expo dev server..."
    cd stewy-mobile && npm start

    cleanup
    ;;
  stop)
    cleanup
    ;;
  *)
    echo "Usage: ./run.sh [all|api|mobile|stop]"
    exit 1
    ;;
esac
