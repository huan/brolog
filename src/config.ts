/**
 * VERSION
 */
let pkg: {
  version: string,
} | undefined

let VERSION = '0.0.0'
try {
  pkg = require('../package.json')
  if (pkg) {
    VERSION = pkg.version
  }
} catch (e) {
  VERSION = '0.0.0'
}

export {
  VERSION,
}

/**
 * BROLOG_LEVEL
 */

const DEFAULT_LEVEL          = 'info'
const BROLOG_LEVEL_VAR_NAME  = 'BROLOG_LEVEL'
const BROLOG_PREFIX_VAR_NAME = 'BROLOG_PREFIX'

let level      : undefined | string
let debugModule: undefined | string

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
  if (!debugModule) {
    debugModule = process.env[BROLOG_PREFIX_VAR_NAME]
  }
}

if (typeof window !== 'undefined' && window.location && typeof window.location.search === 'string') {
  /**
   * Browser
   */
  if (!level) {
    level = getJsonFromUrl()[BROLOG_LEVEL_VAR_NAME]
  }
  if (!debugModule) {
    debugModule = getJsonFromUrl()[BROLOG_LEVEL_VAR_NAME]
  }

  function getJsonFromUrl() {
    // https://stackoverflow.com/questions/8486099/how-do-i-parse-a-url-query-parameters-in-javascript
    const query = location.search.substr(1)
    const result = {} as { [idx: string]: string }
    query.split('&').forEach(function(part) {
      const item = part.split('=')
      result[item[0]] = decodeURIComponent(item[1])
    })
    return result
  }
}

export const BROLOG_LEVEL = level || DEFAULT_LEVEL
export const BROLOG_PREFIX = debugModule || '*'
