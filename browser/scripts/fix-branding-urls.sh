#!/usr/bin/env bash
# surfer writes Zen Browser's URLs into the generated branding files on every import.
# This replaces them with Lobster's own. Called by scripts/import.sh right after `surfer import`.
set -euo pipefail
cd "$(dirname "$0")/.."
REPO="https://github.com/quietbytehq/LoboBrowser"
B=engine/browser/branding/lobster
PREFS=$B/pref/firefox-branding.js
sed -i \
  -e "s#pref(\"startup.homepage_override_url\", \"[^\"]*\")#pref(\"startup.homepage_override_url\", \"\")#" \
  -e "s#pref(\"startup.homepage_welcome_url\", \"[^\"]*\")#pref(\"startup.homepage_welcome_url\", \"$REPO\")#" \
  -e "s#pref(\"startup.homepage_welcome_url.additional\", \"[^\"]*\")#pref(\"startup.homepage_welcome_url.additional\", \"\")#" \
  -e "s#pref(\"app.update.url.manual\", \"[^\"]*\")#pref(\"app.update.url.manual\", \"$REPO/releases\")#" \
  -e "s#pref(\"app.update.url.details\", \"[^\"]*\")#pref(\"app.update.url.details\", \"$REPO/releases/latest\")#" \
  -e "s#pref(\"app.releaseNotesURL\", \"[^\"]*\")#pref(\"app.releaseNotesURL\", \"$REPO/releases\")#" \
  -e "s#pref(\"app.releaseNotesURL.aboutDialog\", \"[^\"]*\")#pref(\"app.releaseNotesURL.aboutDialog\", \"$REPO/releases/tag/v%VERSION%\")#" \
  -e "s#pref(\"app.releaseNotesURL.prompt\", \"[^\"]*\")#pref(\"app.releaseNotesURL.prompt\", \"$REPO/releases/tag/v%VERSION%\")#" \
  "$PREFS"
NSI=$(find $B -name branding.nsi | head -1)
if [ -n "$NSI" ]; then
  sed -i -e "s#https://zen-browser.app/release-notes/[^\"]*#$REPO/releases#g" \
         -e "s#https://zen-browser.app/download#$REPO/releases#g" \
         -e "s#https://github.com/zen-browser/desktop/issues#$REPO/issues#g" \
         -e "s#https://zen-browser.app#$REPO#g" "$NSI"
fi
if grep -rq "zen-browser" "$B"; then
  echo "fix-branding-urls.sh: Zen URLs still present:"; grep -rn "zen-browser" "$B"; exit 1
fi
echo "fix-branding-urls.sh: branding URLs point to $REPO"
