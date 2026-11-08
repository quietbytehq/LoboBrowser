#!/usr/bin/env bash
# Runs `surfer import`, then gives back the old timestamps to every file whose
# content did not change. surfer recreates the branding folder (and re-copies
# src/ files) on each import, which otherwise makes the next build recompile
# almost everything. With this, a rebuild only redoes what really changed.
set -euo pipefail
cd "$(dirname "$0")/.."
export NODE_ENV=development
SNAP=$(mktemp -d)
trap 'rm -rf "$SNAP"' EXIT

# Files surfer may rewrite: the whole branding folder and every file under src/.
mapfile -t FILES < <(
  { [ -d engine/browser/branding ] && (cd engine && find browser/branding -type f); 
    (cd src && find . -type f ! -name '*.patch' ! -name '.gitkeep' | sed 's#^\./##'); } | sort -u)
for f in "${FILES[@]}"; do
  [ -f "engine/$f" ] && { mkdir -p "$SNAP/$(dirname "$f")"; cp -p "engine/$f" "$SNAP/$f"; }
done

./node_modules/.bin/surfer import

kept=0
for f in "${FILES[@]}"; do
  if [ -f "$SNAP/$f" ] && [ -f "engine/$f" ] && cmp -s "$SNAP/$f" "engine/$f"; then
    touch -r "$SNAP/$f" "engine/$f"; kept=$((kept + 1))
  fi
done
echo "import.sh: kept the old timestamp on $kept unchanged files"
