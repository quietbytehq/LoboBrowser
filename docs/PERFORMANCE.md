# Performance

First measurement: 9 November 2026, on the development laptop (HP Victus, 16 threads, 14 GB RAM, Ubuntu 26.04).
Script: [`scripts/speedtest.py`](../scripts/speedtest.py). Medians of 5 runs for startup, 3 runs for memory.

## Results

| Browser | First launch, new profile (s) | Repeat launch, same profile (s) | Memory with 5 sites open (MB) |
| --- | --- | --- | --- |
| **Lobster 0.1** (Firefox ESR 153, native build) | **1.67** | **1.48** | **1,274** |
| Firefox 159 (snap) | 2.95 | 2.20 | 1,574 |
| Brave 1.99 (snap) | 1.15 | 1.11 | not measured (see below) |

**Startup** = seconds from launching the browser until it requests a local test page.
**Memory** = total PSS (shared memory counted once) of all the browser's processes, 25 s after opening the same five live sites: Wikipedia, GitHub, BBC News, Reddit and YouTube.

## What this shows

- Lobster starts about **1.8× faster on first launch** and **1.5× faster on repeat launch** than the Firefox snap, and uses about **19% less memory** with the same five sites open.
- Brave starts faster than Lobster (about 1.1 s against 1.5 s). Closing that gap is a Phase 1 goal.

## Caveats (read before quoting these numbers)

- **Snap vs native.** Firefox and Brave were tested as installed (snaps), which adds start-up overhead from mounting and confinement. Lobster is a native build. Part of Lobster's startup lead is the packaging, not the browser. Lobster will ship as a snap too, so this needs re-testing then.
- **Different Firefox versions.** Lobster is built on Firefox ESR 153; the Firefox snap is 159.
- **Headless.** All browsers ran without a visible window, so GPU and window-drawing costs are not included.
- **Live sites.** The five sites change content and ads between runs, so memory varies by roughly ±5%.
- **Ad blocking.** Lobster installs uBlock Origin from addons.mozilla.org on first run, so it may not have been active for every memory run. Firefox had no blocker; Brave has its own built in.
- **Brave memory not measured.** Headless Brave exited shortly after loading pages, and snap confinement prevented reading its process memory from the test script. Its startup numbers are valid. Memory needs a different method (for example, a visible window, or Brave's own task manager).
- **No cold-cache test.** "First launch" uses a new profile, but the operating system's file cache was not cleared (that needs root). True cold starts after a reboot will be slower for all three.

## How to re-run

```bash
python3 scripts/speedtest.py results.json                  # full test, about 10 minutes
python3 scripts/speedtest.py results.json --memory-only    # redo only the memory part
```

Close other heavy apps first, and don't run it while a build is going.
