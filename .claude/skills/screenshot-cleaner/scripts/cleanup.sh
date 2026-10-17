#!/usr/bin/env bash
# Delete screenshots older than MAX_AGE_HOURS (macOS / Linux).
set -euo pipefail

MAX_AGE_HOURS=23
DRY_RUN=0
TRASH=0
while [ $# -gt 0 ]; do
  case "$1" in
    --dry-run) DRY_RUN=1 ;;
    --trash) TRASH=1 ;;
    --max-age-hours) MAX_AGE_HOURS="$2"; shift ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
  shift
done

LOG_DIR="$HOME/.screenshot-cleaner"
mkdir -p "$LOG_DIR"
LOG="$LOG_DIR/cleanup.log"
log() { echo "$(date '+%Y-%m-%d %H:%M:%S') $*" | tee -a "$LOG"; }

dirs=()
if [ "$(uname)" = "Darwin" ]; then
  loc="$(defaults read com.apple.screencapture location 2>/dev/null || true)"
  dirs+=("${loc:-$HOME/Desktop}")
  [ -n "$loc" ] && [ "$loc" != "$HOME/Desktop" ] && dirs+=("$HOME/Desktop")
else
  dirs+=("$HOME/Pictures/Screenshots" "$HOME/Pictures" "$HOME/ピクチャ" "$HOME/ピクチャ/Screenshots" "$HOME/Desktop" "$HOME/デスクトップ")
fi
if [ -n "${SCREENSHOT_DIRS:-}" ]; then
  IFS=':' read -r -a extra <<< "$SCREENSHOT_DIRS"
  dirs+=("${extra[@]}")
fi

minutes=$((MAX_AGE_HOURS * 60))
count=0
for d in "${dirs[@]}"; do
  [ -d "$d" ] || continue
  while IFS= read -r -d '' f; do
    if [ "$DRY_RUN" = 1 ]; then
      log "[dry-run] $f"
    elif [ "$TRASH" = 1 ] && [ "$(uname)" = "Darwin" ]; then
      mv -n "$f" "$HOME/.Trash/" && log "trashed $f"
    else
      rm -f "$f" && log "deleted $f"
    fi
    count=$((count + 1))
  done < <(find "$d" -maxdepth 1 -type f \
    \( -name 'Screenshot*' -o -name 'Screen Shot*' -o -name 'スクリーンショット*' -o -name 'Screen Recording*' -o -name '画面収録*' \) \
    \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.heic' -o -iname '*.mov' \) \
    -mmin +"$minutes" -print0)
done
log "done: $count file(s) $([ "$DRY_RUN" = 1 ] && echo matched || echo removed)"
