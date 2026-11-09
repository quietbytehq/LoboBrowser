#!/usr/bin/env bash
# Builds Lobster's Linux release files from the output of `surfer package`:
#   release/lobster-<ver>-linux-x86_64.tar.xz   (with Lobster's policies added)
#   release/Lobster_Browser-<ver>-x86_64.AppImage
# Run from anywhere; needs network once to fetch appimagetool.
set -euo pipefail
cd "$(dirname "$0")/.."
VER=$(node -p 'require("./surfer.json").brands.lobster.release.displayVersion')
SRC=$(ls engine/obj-*/dist/lobster-*.linux-x86_64.tar.xz | head -1)
OUT=release; WORK=build-logs/pkg; TOOLS=build-logs/tools
rm -rf "$WORK"; mkdir -p "$WORK" "$OUT" "$TOOLS"

echo "== Unpacking $SRC"
tar -xJf "$SRC" -C "$WORK"
mkdir -p "$WORK/lobster/distribution"
cp distribution/policies.json "$WORK/lobster/distribution/policies.json"

echo "== Tarball"
TAR="$OUT/lobster-$VER-linux-x86_64.tar.xz"
tar -C "$WORK" -cJf "$TAR" lobster

echo "== AppImage"
APPDIR="$WORK/Lobster.AppDir"
mkdir -p "$APPDIR/usr/lib" "$APPDIR/usr/share/icons/hicolor/256x256/apps" "$APPDIR/usr/share/applications"
cp -a "$WORK/lobster" "$APPDIR/usr/lib/lobster"
cat > "$APPDIR/AppRun" <<'RUN'
#!/bin/sh
HERE="$(dirname "$(readlink -f "$0")")"
# An AppImage is mounted at a new path each run; without this, Firefox treats every
# launch as a new installation and creates a fresh profile (first-run page every time).
export MOZ_LEGACY_PROFILES=1
exec "$HERE/usr/lib/lobster/lobster" "$@"
RUN
chmod +x "$APPDIR/AppRun"
cat > "$APPDIR/lobster.desktop" <<'DESK'
[Desktop Entry]
Type=Application
Name=Lobster Browser
GenericName=Web Browser
Comment=Fast, ad-free browser with a private AI agent
Exec=lobster %u
Icon=lobster
Terminal=false
Categories=Network;WebBrowser;
MimeType=text/html;text/xml;application/xhtml+xml;x-scheme-handler/http;x-scheme-handler/https;
StartupWMClass=lobster
DESK
cp "$APPDIR/lobster.desktop" "$APPDIR/usr/share/applications/"
cp ../assets/logo/icons/lobster-256.png "$APPDIR/lobster.png"
cp ../assets/logo/icons/lobster-256.png "$APPDIR/usr/share/icons/hicolor/256x256/apps/lobster.png"

TOOL="$TOOLS/appimagetool-x86_64.AppImage"
if [ ! -x "$TOOL" ]; then
  curl -fsSL -o "$TOOL" https://github.com/AppImage/appimagetool/releases/download/continuous/appimagetool-x86_64.AppImage
  chmod +x "$TOOL"
fi
APP="$OUT/Lobster_Browser-$VER-x86_64.AppImage"
ARCH=x86_64 "$TOOL" --appimage-extract-and-run "$APPDIR" "$APP"

echo "== Done"
ls -la "$OUT"
