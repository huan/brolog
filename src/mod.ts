/**
 * Public entry point for Brolog: isomorphic leveled logger for browser, Node.js, and Deno.
 */
import {
  VERSION,
}               from './config.ts'
import {
  Brolog,
  log,
}               from './brolog.ts'
import {
  type Logger,
  getLogger,
}               from './logger.ts'

/**
 * @deprecated: use Logger instead.
 */
type Loggable = Logger

/**
 * @deprecated: use getLogger instead.
 */
const getLoggable = getLogger

export {
  type Loggable,
  type Logger,
  VERSION,
  Brolog,
  getLoggable,
  getLogger,
  log,
}
