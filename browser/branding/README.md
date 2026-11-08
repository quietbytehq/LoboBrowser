# Branding

Everything that makes the build "Lobster" instead of "Firefox".

| Item | Status |
| --- | --- |
| App name, vendor, profile folder, window class | Done — `surfer.json` (`brands.lobster`), files in `browser/configs/branding/lobster` |
| App icon (glossy logo), 16–512 px | Done — `assets/logo/icons/lobster-*.png`, Windows `lobster.ico` |
| Flat one-colour logo (toolbar, throbber) | Done (first version) — `assets/logo/lobster-mark.svg`, PNGs in `assets/logo/icons/lobster-mark-*` |
| Splash (first launch after reboot) | Done — animated `browser/branding/splash/splash.html` (about 2.6 s, still frame with reduce-motion), static `splash.png` and `splash@2x.png`, preview `splash-preview.mp4` |
| About page and new-tab page | About dialog, about:logo and private-browsing logo done; new-tab page to do |

Firefox trademarks and logos must not appear anywhere in the shipped build.
