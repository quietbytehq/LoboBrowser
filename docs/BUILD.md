# Building Lobster Browser

## Requirements

- Linux (Ubuntu 24.04 or similar)
- About 40 GB of free disk, 16 GB+ RAM (more RAM = faster builds)
- Node.js 20+ (for surfer)
- Rust stable (for DSH): https://rustup.rs
- Python 3 and the usual Firefox build dependencies (installed by the bootstrap step)

The first Firefox build can take one to several hours depending on your CPU. Later builds are much faster.

## 1. Browser (Firefox ESR fork)

The browser is managed with [surfer](https://github.com/zen-browser/surfer), the open-source fork tool used by Zen Browser.
We pin surfer to a known version so builds stay reproducible.

> **Verify against surfer's own README before first use** — command names and project setup can change between surfer versions.

Typical flow:

```bash
cd browser
npm install                 # installs the pinned surfer version
npx surfer setup-project    # first time only: creates the project config for Firefox ESR
npx surfer download         # downloads the Firefox ESR source
npx surfer import           # applies patches/ and branding/
npx surfer bootstrap        # installs Firefox build dependencies
npx surfer build            # builds the browser
npx surfer run              # runs your build
npx surfer package          # makes a distributable package
```

## 2. DSH (Rust)

```bash
cd dsh
cargo build
cargo test
```

## Updating to a new Firefox ESR release

1. Change the ESR version in the surfer project config.
2. `npx surfer download && npx surfer import`
3. Fix any patches that fail to apply.
4. Build, run, and smoke-test before committing.
