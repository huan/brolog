#!/usr/bin/env bash
set -e

TMPDIR="/tmp/brolog-npm.$$"
mkdir "$TMPDIR"
npm pack
mv *-*.*.*.tgz "$TMPDIR"
cp tests/fixtures/smoke-testing.js "$TMPDIR"

cd $TMPDIR
npm init -y
npm install brolog-*.*.*.tgz

ls -l
ls -l node_modules/
ls -l node_modules/brolog/

node smoke-testing.js
