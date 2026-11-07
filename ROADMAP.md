# Roadmap

Core first: a fast, ad-free browser you can use every day, then the AI, then the agent.
Each phase ends in a tagged GitHub release. Estimates are rough, part-time.

## Phase 0 — Foundations (1–2 weeks)

- [ ] Check "Lobster Browser" is free on GitHub, Flathub and the Snap Store
- [ ] Create this repo with licence, README and roadmap
- [ ] Logo icon sizes (16–512 px) and a flat one-colour version for the toolbar
- [ ] Build environment ready (about 40 GB disk, 16 GB+ RAM)
- [ ] Plain Firefox ESR builds from source through surfer
- [ ] Design the Rust DSH: module layout, config format, native messaging protocol
- [ ] GitHub Actions for Linux builds

**Gate:** stock Firefox ESR builds from the repo, locally and in CI.

## Phase 1 — Core browser (v0.1, 3–5 weeks)

- [ ] Lobster branding: app name, profile, icons, about page, new-tab page
- [ ] Light and dark theme
- [ ] Splash on first launch after each reboot (can be turned off; still logo with reduce-motion)
- [ ] Lobster throbber in the toolbar: ring orbits while a page loads
- [ ] uBlock Origin bundled and on by default; shield button per site
- [ ] Remove telemetry, Pocket, sponsored content, Firefox's AI chatbot sidebar
- [ ] Tuned performance settings; unload inactive tabs
- [ ] Search: Google (normal), DuckDuckGo (private), plus Brave Search, Startpage, SearXNG
- [ ] Linux tarball and AppImage

**Gate:** one week as your main browser with no blocking bugs, no slower than stock Firefox.

## Phase 2 — DSH core and AI sidebar (v0.2, 4–6 weeks)

- [ ] Rust DSH service: starts on first use, stops when idle
- [ ] Native messaging link between browser and DSH
- [ ] Model router: DeepSeek and OpenRouter, plus Ollama for local models
- [ ] Key vault: OS keychain, keys locked to provider domains, masked in the UI, never logged
- [ ] Setup wizard: mode, provider and key, summary
- [ ] AI sidebar: ask about the page, summarise, explain a selection
- [ ] Throbber states: thinking, done, error

**Gate:** a new user installs, runs the wizard, adds a key and summarises any page; no key appears in any file, log or web page.

## Phase 3 — Privacy and limits (v0.3, 3–4 weeks)

- [ ] Privacy gateway Lite (patterns) and Standard (small detection model in Rust)
- [ ] Optional Full mode via a Presidio add-on
- [ ] Preview of what was removed before sending
- [ ] Per-key daily caps with alert and hard stop; usage panel
- [ ] Audit log; optional master PIN; encrypted key export
- [ ] More providers: Qwen, OpenAI, Claude, Grok

**Gate:** a test page full of fake personal data is summarised with all of it removed; caps stop requests at their limit.

## Phase 4 — Agent (v0.6, 5–8 weeks)

- [ ] Web agent: read, fill and click, with approval before each submit or send
- [ ] Background task tabs; compare answers from several models
- [ ] Machine access levels: Off, Read-only, Ask every time, Trusted folders
- [ ] Sandboxed commands (bubblewrap), stop button, full action log
- [ ] Throbber states: acting, waiting for approval
- [ ] Prompt-injection test pages, all passing

**Gate:** 10 sample tasks done correctly; every injection test page passed.

## Phase 5 — Release (v1.0, 4–6 weeks)

- [ ] Snap Store and Flathub packages
- [ ] Windows build and installer
- [ ] Remote LAN mode (DSH server, IT-managed keys)
- [ ] Automatic updates and an ESR rebase routine
- [ ] Security review of vault and agent

**Gate:** v1.0 live on GitHub, the Snap Store and Flathub, with a Windows installer.

## After 1.0

Native ad blocking with adblock-rust, cookie-banner blocking, workspaces and vertical tabs, offline page saving.
