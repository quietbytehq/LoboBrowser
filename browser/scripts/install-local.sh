#!/usr/bin/env bash
# Installs the Lobster AppImage for the current user only (no sudo):
#   ~/Applications/Lobster_Browser.AppImage, an app-menu entry and its icon.
# Re-run after building a new AppImage to update it. Remove with --uninstall.
set -euo pipefail
cd "$(dirname "$0")/.."
APPS="$HOME/Applications"; DESK="$HOME/.local/share/applications/lobster-browser.desktop"
ICON="$HOME/.local/share/icons/hicolor/256x256/apps/lobster-browser.png"
if [ "${1:-}" = "--uninstall" ]; then
  rm -f "$APPS/Lobster_Browser.AppImage" "$DESK" "$ICON"; echo "Lobster removed."; exit 0
fi
APP=$(ls -t release/Lobster_Browser-*-x86_64.AppImage | head -1)
mkdir -p "$APPS" "$(dirname "$DESK")" "$(dirname "$ICON")"
cp "$APP" "$APPS/Lobster_Browser.AppImage"; chmod +x "$APPS/Lobster_Browser.AppImage"
cp ../assets/logo/icons/lobster-256.png "$ICON"
cat > "$DESK" <<DESKTOP
[Desktop Entry]
Type=Application
Name=Lobster Browser
GenericName=Web Browser
Comment=Fast, ad-free browser with a private AI agent
Exec=$APPS/Lobster_Browser.AppImage %u
Icon=lobster-browser
Terminal=false
Categories=Network;WebBrowser;
MimeType=text/html;text/xml;application/xhtml+xml;x-scheme-handler/http;x-scheme-handler/https;
StartupNotify=true
StartupWMClass=lobster
Actions=new-window;new-private-window;

[Desktop Action new-window]
Name=New Window
Exec=$APPS/Lobster_Browser.AppImage --new-window %u

[Desktop Action new-private-window]
Name=New Private Window
Exec=$APPS/Lobster_Browser.AppImage --private-window %u
DESKTOP
update-desktop-database "$(dirname "$DESK")" 2>/dev/null || true
gtk-update-icon-cache -f -t "$HOME/.local/share/icons/hicolor" 2>/dev/null || true
echo "Installed $(basename "$APP") -> $APPS/Lobster_Browser.AppImage (find 'Lobster Browser' in your app menu)"
