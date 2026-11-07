<p align="center">
  <img src="assets/logo/lobster-logo.png" alt="Lobster Browser logo" width="180">
</p>

<h1 align="center">Lobster Browser</h1>

<p align="center">
  A fast, ad-free Firefox-based browser with a private AI agent built in.<br>
  Hard shell outside. Your data stays inside.
</p>

---

> **Status:** early development (Phase 0 — Foundations). Nothing to download yet.

## What it is

Lobster Browser is a Firefox ESR fork with **DSH**, a local AI agent written in Rust, built in.

- **Fast and ad-free** — ad and tracker blocking on by default, telemetry and sponsored content removed.
- **Your choice of AI** — DeepSeek, Qwen, OpenAI, Claude, Grok, OpenRouter, or local models through Ollama.
- **Privacy gateway** — personal data (names, emails, phone and ID numbers) is removed *before* a prompt leaves your machine.
- **Keys you can trust it with** — API keys live in your OS keychain, are locked to their provider's domain, and carry spending caps. The browser itself never holds a key.
- **Agent with permission levels** — Off, Read-only, Ask every time, or Trusted folders. Off by default.
- **Works with zero accounts** — search plus a local model needs no sign-in at all.

## Default search

| Window | Default engine |
| --- | --- |
| Normal | Google |
| Private | DuckDuckGo |

Both can be changed on first run or in Settings.

## Repository layout

```
LoboBrowser/
├── browser/            Firefox fork (managed with surfer)
│   ├── patches/        Lobster changes to Firefox, as plain patch files
│   ├── branding/       Names, icons, splash, about page
│   ├── prefs/          Default preferences (privacy, speed, search)
│   └── policies/       Enterprise policies (bundled uBlock Origin, telemetry off)
├── dsh/                DSH agent engine (Rust workspace)
│   └── crates/
│       ├── dsh/        Service binary: starts DSH, wires the parts together
│       ├── protocol/   Messages between the browser and DSH (native messaging)
│       ├── vault/      API key vault on top of the OS keychain
│       ├── router/     Sends each request to the chosen model provider
│       └── gateway/    Privacy gateway and spending limits
├── docs/               Architecture and build guides
└── assets/             Logo and artwork
```

## Building

See [docs/BUILD.md](docs/BUILD.md). In short: a Linux machine with about 40 GB of free disk and 16 GB+ of RAM, Node.js for surfer, and Rust for DSH.

## Roadmap

See [ROADMAP.md](ROADMAP.md). Linux first; Windows arrives with v1.0.

## Security

API keys and the agent's machine access are the most sensitive parts of this project. Please read [SECURITY.md](SECURITY.md) and report vulnerabilities privately.

## Licence

[Mozilla Public License 2.0](LICENSE), the same licence as Firefox.

Lobster Browser is an independent project by [Quietbyte](https://github.com/quietbytehq). It is not affiliated with or endorsed by Mozilla. Firefox is a trademark of the Mozilla Foundation.
