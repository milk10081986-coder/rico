#!/usr/bin/env bash
# Register (or remove with --uninstall) an hourly cron job for cleanup.sh.
set -euo pipefail

DEST="$HOME/.screenshot-cleaner/cleanup.sh"
MARK="# screenshot-cleaner"

current="$(crontab -l 2>/dev/null | grep -v "$MARK" || true)"
if [ "${1:-}" = "--uninstall" ]; then
  printf '%s\n' "$current" | crontab -
  rm -f "$DEST"
  echo "uninstalled"
  exit 0
fi

mkdir -p "$(dirname "$DEST")"
cp "$(cd "$(dirname "$0")" && pwd)/cleanup.sh" "$DEST"
chmod +x "$DEST"
printf '%s\n%s\n' "$current" "0 * * * * /bin/bash $DEST $* >/dev/null 2>&1 $MARK" | sed '/^$/d' | crontab -
echo "installed: runs every hour (crontab)"
