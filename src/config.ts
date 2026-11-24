/**
 * Runtime environment configuration for Brolog: extracts default log level
 * and module prefix filters from process.env (Node.js/Deno) or URL search parameters (browser).
 */
import { VERSION } from './version.ts'

const DEFAULT_LEVEL = 'info'
const BROLOG_LEVEL_VAR_NAME = 'BROLOG_LEVEL'
const BROLOG_PREFIX_VAR_NAME = 'BROLOG_PREFIX'

let level: undefined | string
let debugModule: undefined | string

if (typeof process !== 'undefined' && process.env) {
  if (!level) {
    level = process.env[BROLOG_LEVEL_VAR_NAME]
  }
  if (!debugModule) {
    debugModule = process.env[BROLOG_PREFIX_VAR_NAME]
  }
}

if (typeof window !== 'undefined' && typeof window.location?.search === 'string') {
  if (!level) {
    level = getJsonFromUrl()[BROLOG_LEVEL_VAR_NAME]
  }
  if (!debugModule) {
    debugModule = getJsonFromUrl()[BROLOG_LEVEL_VAR_NAME]
  }
}

function getJsonFromUrl (): Record<string, string> {
  const query = location.search.substring(1)
  const result: Record<string, string> = {}
  query.split('&').forEach((part) => {
    if (!part) return
    const [key, val] = part.split('=')
    if (key) {
      result[key] = decodeURIComponent(val || '')
    }
  })
  return result
}

const BROLOG_LEVEL = level
const BROLOG_PREFIX = debugModule

export {
  VERSION,
  DEFAULT_LEVEL,
  BROLOG_LEVEL,
  BROLOG_PREFIX,
}
