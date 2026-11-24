#!/usr/bin/env bash
#
# Sets package.json publishConfig.tag before `npm publish`.
#
# Same rule as @chatie/semver isProd, which this repo used to shell out to:
#   - a prerelease (2.0.0-alpha.1) is a development release -> tag "next"
#   - an even minor (2.0.x, 1.16.x) is a production release -> tag "latest"
#   - an odd minor (2.1.x, 1.15.x) is a development release -> tag "next"
#
# The committed default stays "next", so a publish that skips this script
# cannot move the `latest` dist-tag.
#
set -euo pipefail

node --input-type=module <<'EOF'
import { readFileSync, writeFileSync } from 'node:fs'

const pkgPath = 'package.json'
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
const version = String(pkg.version ?? '')

// major.minor.patch, optional prerelease, optional build metadata.
const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/)
if (!match) {
  console.error(`package-publish-config-tag: invalid semver ${JSON.stringify(version)}`)
  process.exit(1)
}

const minor = Number(match[2])
const prerelease = match[4]
const isProd = !prerelease && minor % 2 === 0
const tag = isProd ? 'latest' : 'next'

pkg.publishConfig = {
  ...pkg.publishConfig,
  tag,
}
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

if (isProd) {
  console.log('production release: publishConfig.tag set to latest.')
} else {
  console.log('development release: publishConfig.tag set to next.')
}
EOF
