# Building Lobster Browser

## Requirements

- Linux (Ubuntu 24.04 or similar)
- About 40 GB of free disk, 16 GB+ RAM (more RAM = faster builds)
- Node.js 20+ (for surfer)
- Rust stable (for DSH): https://rustup.rs
- Python 3 and the usual Firefox build dependencies (installed by the bootstrap step)

The first Firefox build can take one to several hours depending on your CPU. Later builds are much faster.

## 1. Browser (Firefox ESR fork)

The browser is managed with [surfer](https://github.com/zen-browser/surfer) (pinned to 1.14.9 in `browser/package.json`), the open-source fork tool used by Zen Browser. The project is already set up: `browser/surfer.json` picks Firefox ESR 153.6.0esr and names the app Lobster, and `browser/configs/` holds the build settings.

> Always run surfer through `./node_modules/.bin/surfer`, not a bare `npx surfer`: an unrelated npm package is also called "surfer", and npx will fetch it if the local install is missing.

```bash
cd browser
npm install --include=dev                 # installs surfer (see note below)
./node_modules/.bin/surfer download       # downloads and unpacks the Firefox ESR source (~800 MB)
./node_modules/.bin/surfer import         # applies src/, patches/ and branding/
./node_modules/.bin/surfer build          # builds; downloads compilers on first run
./node_modules/.bin/surfer run            # runs your build
```

The built browser ends up at `browser/engine/obj-x86_64-pc-linux-gnu/dist/bin/lobster`.

### Notes from the first build

- **`--include=dev` matters.** If your shell has `NODE_ENV=production`, npm silently skips surfer (a dev dependency).
- **Memory.** The largest Rust step needs about 7–8 GB on its own. With 14 GB of RAM, the build is limited to 4 jobs (`configs/common/mozconfig`) and needs extra swap. A temporary 16 GB swap file was enough:
  ```bash
  sudo fallocate -l 16G /swapfile-build && sudo chmod 600 /swapfile-build
  sudo mkswap /swapfile-build && sudo swapon /swapfile-build
  ```
  Close heavy apps while building.
- **Time.** The first build took about 1 hour of compiling on a 16-thread laptop, plus downloads (source and compilers, about 3 GB in total). Later builds are much faster.
- **sccache** is switched off in `configs/linux/mozconfig` for now; enable it once installed to speed up rebuilds.
- **Quick check without a window:**
  ```bash
  ./engine/obj-x86_64-pc-linux-gnu/dist/bin/lobster --headless --screenshot out.png https://example.org
  ```

## 2. DSH (Rust)

```bash
cd dsh
cargo build
cargo test
```

## Updating to a new Firefox ESR release

1. Change the ESR version in the surfer project config.
2. `./node_modules/.bin/surfer download && ./node_modules/.bin/surfer import`
3. Fix any patches that fail to apply.
4. Build, run, and smoke-test before committing.

### Defaults and policies

- `src/browser/app/profile/lobster.js` holds Lobster's default prefs. It is pulled into Firefox's defaults by `src/browser/app/profile/firefox-js.patch` (an `#include` at the end of `firefox.js`).
- `distribution/policies.json` holds enterprise policies (default search engines, uBlock Origin). `scripts/post-build.sh` copies it to `dist/bin/distribution/` after each build; packages must ship the same folder.
- Check active policies in the browser at `about:policies`.
- Note: after `surfer import`, the next build has sometimes recompiled almost everything (about 40-70 min). The cause is not yet confirmed; suspect the branding folder being recreated on import.

### Fast rebuilds

- Run `scripts/import.sh` instead of `surfer import`. It imports, then restores the old timestamps on files whose content did not change, so the next build only redoes real changes.
- The repo changeset is no longer stamped into local builds (`MOZ_SOURCE_CHANGESET`, `MOZ_SOURCE_REPO` and `MOZ_INCLUDE_SOURCE_INFO` are commented out in `configs/common/mozconfig`). It changed with every commit and forced a near-full rebuild each time. Turn them back on for release builds (all three together: `source-repo.h` fails if the repo is set without a changeset).

### Running a local build directly

Local builds keep many files as symlinks into the source tree. If you start `dist/bin/lobster` directly (not with `surfer run`), set these first, or the content sandbox blocks those files and pages such as the new tab fail with "Access to the file was denied":

```bash
export MOZ_DEVELOPER_REPO_DIR=$PWD/engine MOZ_DEVELOPER_OBJ_DIR=$PWD/engine/obj-x86_64-pc-linux-gnu
```

Packaged builds are not affected.
