let pkg: {
  version: string,
} | undefined

try {
  pkg = require('../package.json')
} catch (e) {
  // ignore
}

if (!pkg) {
  try {
    pkg = require('../../package.json')
  } catch (e) {
    // ignore
  }
}

let VERSION = 'unknown'
if (pkg) {
  VERSION = pkg.version
}

export {
  VERSION,
}
