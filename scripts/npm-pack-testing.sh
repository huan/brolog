#!/usr/bin/env bash
set -e

npm run dist
npm pack

TMPDIR="/tmp/npm-pack-testing.$$"
mkdir "$TMPDIR"
mv *-*.*.*.tgz "$TMPDIR"
cp tests/fixtures/smoke-testing.ts "$TMPDIR"

cd $TMPDIR
npm init -y
npm install *-*.*.*.tgz \
  source-map@latest \
  typescript@latest

./node_modules/.bin/tsc \
  --lib esnext,dom \
  --noEmitOnError \
  --noImplicitAny \
  smoke-testing.ts

node smoke-testing.js
