var conlog = (function() {
  var DEFAULT_LEVEL = 'INFO'
  var LEVELS = {
    ERR:  1
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

  var currentLevel = LEVELS[DEFAULT_LEVEL]
  var currentLevelName = DEFAULT_LEVEL

  return {
    LEVELS: LEVELS
    , level: level

    , log: log

    , error: error
    , warn: warn
    , info: info

    , verbose: verbose
    , verb:    verbose

    , silly: silly
    , sill: silly
  }

  //////////////////////////////////////////////////////////////////////////////

  function level(l) {
    if (typeof l !== 'undefined') {
      l = String(l).toUpperCase()
      if (LEVELS_ALIAS[l]) {
        l = LEVELS_ALIAS[l]
      }
      if (LEVELS[l]) {
        currentLevel = LEVELS[l]
        currentLevelName = l
      } else {
        currentLevel = LEVELS[DEFAULT_LEVEL]
        currentLevelName = DEFAULT_LEVEL
      }
    }
    return currentLevel
  }

  function log(level, prefix, message) {
    var args = Array.prototype.slice.call(arguments, 3) || []
    args.unshift(level + ' ' + prefix + ' ' + message)

    switch (level) {
      case 'ERR':
        console.warn.apply(console, args)
        break
      case 'WARN':
        console.error.apply(console, args)
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

module.exports = conlog.default = conlog.conlog = conlog
