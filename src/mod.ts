import {
  VERSION,
}               from './config.js'
import {
  Brolog,
  log,
}               from './brolog.js'
import {
  type Logger,
  getLogger,
}               from './logger.js'

/**
 * @deprecated: use Logger instead. will be removed after Dec 31, 2022
 */
type Loggable = Logger

/**
 * @deprecated: use getLogger instead. will be removed after Dec 31, 2022
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
