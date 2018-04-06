let pkg: {
  version: string,
} | undefined

try {
  pkg = require('../package.json')
} catch (e) {
  // ignore
}

// Comment the following code out because
// the Brolog will live in /bundles directory
//
// if (!pkg) {
//   try {
//     pkg = require('../../package.json')
//   } catch (e) {
//     // ignore
//   }
// }

let VERSION = 'unknown'
if (pkg) {
  VERSION = pkg.version
}

export {
  VERSION,
}
