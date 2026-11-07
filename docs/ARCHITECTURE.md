# Architecture

```
┌──────────────────────────────┐        ┌──────────────────────────────┐
│ Lobster Browser (Firefox ESR)│        │ DSH server on LAN (optional) │
│ UI, search, AI sidebar       │ ─ or ─▶│ remote mode, IT holds keys   │
│ holds NO API keys            │        └──────────────────────────────┘
└──────────────┬───────────────┘
               │ native messaging (JSON over stdin/stdout)
┌──────────────▼───────────────────────────────────────────────────────┐
│ DSH engine (Rust, local service, starts on first use)                 │
│  protocol ─ vault (OS keychain) ─ gateway (privacy + limits) ─ router │
└──────┬──────────────────────┬──────────────────────────┬─────────────┘
       ▼                      ▼                          ▼
  Cloud APIs             Local models              Your machine
  (DeepSeek, Qwen,       (Ollama)                  (sandboxed, by
   OpenAI, Claude,                                  permission level)
   Grok, OpenRouter)
```

## Request path

1. The browser sends a request (prompt + page context) to DSH over native messaging.
2. **gateway** removes personal data and checks the caps for the chosen key.
3. **router** picks the provider; **vault** hands it the key only for that provider's domain.
4. The answer comes back the same way. The key never reaches the browser.

## Crates

| Crate | Job |
| --- | --- |
| `protocol` | Message types shared by browser and DSH; native messaging framing |
| `vault` | Store, read, test and revoke keys in the OS keychain; domain lock |
| `gateway` | Personal-data scrubbing (Lite, Standard, Full) and spending limits |
| `router` | Provider clients and model selection |
| `dsh` | The service binary that ties them together |
