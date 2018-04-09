/**
 * VERSION
 */
let pkg: {
  version: string,
} | undefined

let VERSION = 'unknown'
try {
  pkg = require('../package.json')
  if (pkg) {
    VERSION = pkg.version
  }
} catch (e) {
  VERSION = 'not found'
}

export {
  VERSION,
}

/**
 * BROLOG_LEVEL
 */

const DEFAULT_LEVEL         = 'info'
const BROLOG_LEVEL_VAR_NAME = 'BROLOG_LEVEL'

let level: string | undefined

/**
 * Sometimes there's a `process` in browser (ionic3 & angular5)
 * Sometimes there's a window in Node.js (browserify)
 */

if (typeof process !== 'undefined' && process.env) {
  /**
   * Node.js
   */
  if (!level) {
    level = process.env[BROLOG_LEVEL_VAR_NAME]
  }
}

if (typeof window !== undefined && window.location && typeof window.location.search === 'string') {
  /**
   * Browser
   */
  if (!level) {
    level = getJsonFromUrl()[BROLOG_LEVEL_VAR_NAME]
  }

  function getJsonFromUrl() {
    // https://stackoverflow.com/questions/8486099/how-do-i-parse-a-url-query-parameters-in-javascript
    const query = location.search.substr(1)
    const result = {}
    query.split('&').forEach(function(part) {
      const item = part.split('=')
      result[item[0]] = decodeURIComponent(item[1])
    })
    return result
  }
}

export const BROLOG_LEVEL = level || DEFAULT_LEVEL
