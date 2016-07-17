/*!
 * Brolog JavaScript Library v3.1.0
 * https://github.com/zixia/brolog
 *
 * Copyright Zhuohuan LI <zixia@zixia.net>
 * Released under the ISC license
 * https://github.com/zixia/brolog/blob/master/LICENSE
 *
 * Date: 2017-07
 */

;(function(global, factory) {

  'use strict'

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(global, true)
  } else {
    factory(global)
  }

// Pass this if window is not defined yet
})(typeof window !== 'undefined' ? window : this, function(window, noGlobal) {

  'use strict'

var Brolog = (function() {
  var LEVELS = {
    SILENT: 0

    , ERR:  1
    , ERROR: 1

    , WARN: 2
    , INFO: 3

    , VERB: 4
    , VERBOSE: 4

    , SILL: 5
    , SILLY: 5
  }
  var LEVELS_ALIAS = {
    ERROR: 'ERR'
    , VERBOSE: 'VERB'
    , SILLY: 'SILL'
  }

  // set by defaultLevel:
  var DEFAULT_LEVEL = 'INFO'
  var currentLevel
  var currentLevelName

  defaultLevel('INFO')
  level(DEFAULT_LEVEL)

  function Brolog() {
    /**
     *
     * Brolog might be called by 3 ways:
     *
     * 1. const log = Brolog()        // in Javascript
     * 2. const log = Brolog.Brolog() // in Typescript: import { Brolog } from 'brolog'; const log = Brolog()
     * 3. const log = new Brolog()
     *
     */
    if (!this) {                              // 1. Brolog()
      return Brolog
    } else if (typeof this === 'function') {  // 2. Brolog.Brolog()
      return this
    } else if (typeof this === 'object') {    // 3. new Brolog()
      return Brolog
    } else {
      throw new Error('unknown call stack')
    }
  }

  assign(Brolog)

  return Brolog

  //////////////////////////////////////////////////////////////////////////////

  function assign(obj) {
    obj.factory = factory

    obj.level        = level
    obj.defaultLevel = defaultLevel
    obj.LEVELS       = LEVELS

    obj.error   = error
    obj.warn    = warn
    obj.info    = info

    obj.verbose = verbose
    obj.verb    = verbose

    obj.silly   = silly
    obj.sill    = silly

    return obj
  }

  function level(levelName) {
    if (typeof levelName !== 'undefined') {
      levelName = String(levelName).toUpperCase()
      if (LEVELS_ALIAS[levelName]) {
        levelName = LEVELS_ALIAS[levelName]
      }
      if (typeof LEVELS[levelName] === 'undefined') {
        throw new Error('unknown level: ' + levelName)
      }
      currentLevel = LEVELS[levelName]
      currentLevelName = levelName
    }
    return currentLevelName
  }

  function defaultLevel(levelName) {
    if (typeof levelName !== 'undefined') {
      DEFAULT_LEVEL = level(levelName)
    }
    return DEFAULT_LEVEL
  }

  function factory(levelName) {
    defaultLevel(levelName)
    return Brolog
  }

  function log(level, prefix, message) {
    var args = Array.prototype.slice.call(arguments, 3) || []
    args.unshift(level + ' ' + prefix + ' ' + (message || ''))

    switch (level) {
      case 'ERR':
        console.error.apply(console, args)
        break
      case 'WARN':
        console.warn.apply(console, args)
        break
      case 'INFO':
        console.info.apply(console, args)
        break

      default:
      case 'VERB':
      case 'SILL':
        console.log.apply(console, args)
    }
  }

  function error() {
    if (currentLevel < LEVELS.ERROR) {
      return
    }

    var args = Array.prototype.slice.call(arguments)
    args.unshift('ERR')
    log.apply(this, args)
  }

  function warn() {
    if (currentLevel < LEVELS.WARN) {
      return
    }

    var args = Array.prototype.slice.call(arguments)
    args.unshift('WARN')
    log.apply(this, args)
  }

  function info() {
    if (currentLevel < LEVELS.INFO) {
      return
    }

    var args = Array.prototype.slice.call(arguments)
    args.unshift('INFO')
    log.apply(this, args)
  }

  function verbose() {
    if (currentLevel < LEVELS.VERBOSE) {
      return
    }

    var args = Array.prototype.slice.call(arguments)
    args.unshift('VERB')
    log.apply(this, args)
  }

  function silly() {
    if (currentLevel < LEVELS.SILLY) {
      return
    }

    var args = Array.prototype.slice.call(arguments)
    args.unshift('SILL')
    log.apply(this, args)
  }

}())

  // Expose Brolog, even in AMD and CommonJS for browser emulators
  if (!noGlobal) {
    window.Brolog = Brolog
  }

  // module.exports = Brolog.default = Brolog.Brolog = Brolog
  Brolog.default = Brolog.Brolog = Brolog

  return Brolog

})

