#!/usr/bin/env bash
# Register (or remove with --uninstall) an hourly launchd job for cleanup.sh.
set -euo pipefail

LABEL="com.user.screenshot-cleaner"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
DEST="$HOME/.screenshot-cleaner/cleanup.sh"

if [ "${1:-}" = "--uninstall" ]; then
  launchctl unload "$PLIST" 2>/dev/null || true
  rm -f "$PLIST" "$DEST"
  echo "uninstalled"
  exit 0
fi

mkdir -p "$(dirname "$DEST")" "$(dirname "$PLIST")"
cp "$(cd "$(dirname "$0")" && pwd)/cleanup.sh" "$DEST"
chmod +x "$DEST"

cat > "$PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array><string>/bin/bash</string><string>$DEST</string>$(for a in "$@"; do printf '<string>%s</string>' "$a"; done)</array>
  <key>StartInterval</key><integer>3600</integer>
  <key>RunAtLoad</key><true/>
</dict>
</plist>
PLIST

launchctl unload "$PLIST" 2>/dev/null || true
launchctl load "$PLIST"
echo "installed: runs every hour ($PLIST)"
