#!/usr/bin/env bash
set -e

npm run dist
npm pack

TMPDIR="/tmp/brolog-npm.$$"
mkdir "$TMPDIR"
mv *-*.*.*.tgz "$TMPDIR"
cp tests/fixtures/smoke-testing.js "$TMPDIR"

cd $TMPDIR
npm init -y
npm install *-*.*.*.tgz

ls -l
ls -l node_modules/
ls -l node_modules/brolog/

node smoke-testing.js
