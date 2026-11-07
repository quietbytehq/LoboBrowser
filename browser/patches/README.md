# Patches

Lobster's changes to the Firefox ESR source, as plain patch files applied by surfer.

Rules:

- **One topic per patch** (for example `branding-app-name.patch`, `search-private-default.patch`).
- **Keep patches small.** Small patches survive Firefox ESR updates; big ones break.
- **Prefer prefs and policies over patches.** If `prefs/lobster.js` or `policies/policies.json` can do it, don't patch the source.
- After each ESR update, re-apply all patches and fix any that fail before doing anything else.

Planned patches for Phase 1:

| Patch | Purpose |
| --- | --- |
| `branding-*` | App name, icons, about page |
| `search-private-default` | DuckDuckGo as the private-window default |
| `splash-cold-start` | Splash on first launch after a reboot |
| `throbber` | Lobster loading animation in the toolbar |
| `remove-ai-chatbot` | Hide Firefox's built-in AI sidebar entry points |
