#!/usr/bin/env bash
# Copies Lobster's distribution files (enterprise policies) next to the built browser.
# Run after `surfer build`. Packaging (Snap, tarball) must include the same folder.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=$(ls -d engine/obj-*/dist/bin | head -1)
mkdir -p "$OUT/distribution"
cp distribution/policies.json "$OUT/distribution/policies.json"
echo "Copied policies to $OUT/distribution"
