#!/usr/bin/env bash
#
# Packs brolog and checks that the tarball works as an ESM consumer sees it:
# installs it in a temporary ESM project, type-checks against published types,
# and runs the smoke test with Node.js.
#
set -euo pipefail

PACKAGE_DIR=$(pwd)
TMPDIR="/tmp/npm-pack-testing.$$"
mkdir "$TMPDIR"

# generate-version.sh rewrites src/version.ts; put back exactly what was there
cp src/version.ts "$TMPDIR/version.ts.orig"
trap 'cp "$TMPDIR/version.ts.orig" "$PACKAGE_DIR/src/version.ts"; rm -rf "$TMPDIR"' EXIT

./scripts/generate-version.sh
npm run dist
npm pack --pack-destination "$TMPDIR"
cp tests/fixtures/smoke-testing.ts "$TMPDIR"

cd "$TMPDIR"
npm init -y > /dev/null
npm pkg set type=module
npm install ./brolog-*.tgz \
  @types/node \
  @typescript/native@npm:typescript@^7.0.2

npx tsc \
  --target esnext \
  --module nodenext \
  --moduleResolution nodenext \
  --verbatimModuleSyntax \
  --lib esnext,dom \
  --noEmitOnError \
  --noImplicitAny \
  --skipLibCheck \
  smoke-testing.ts

echo
echo "ES Module: pack testing..."
node smoke-testing.js
