'use strict'

const test = require('tap').test

const Brolog = require('..')

test('Brolog factory/service/function init level test', t => {

  const EXPECTED_LEVEL = 'SILL'

  var l = Brolog.level()
  t.equal(l, 'INFO', 'should has default level INFO')

  var LogClass = Brolog.factory(EXPECTED_LEVEL)
  t.equal(typeof LogClass, 'function', 'should return a function class when we call Brolog as factory')

  var log = new LogClass()
  t.equal(typeof log, 'function', 'should still return function when we call new Brolog as class')

  var dl = log.defaultLevel()
  var ll = log.level()
  t.equal(dl, EXPECTED_LEVEL, 'should has default level as EXPECTED_LEVEL after factory & class init')
  t.equal(ll, EXPECTED_LEVEL, 'should has current level as EXPECTED_LEVEL after factory & class init')

  Brolog.defaultLevel('SILENT')
  Brolog.level('SILENT')

  log = Brolog(EXPECTED_LEVEL)
  dl = log.defaultLevel()
  ll = log.level()
  t.equal(dl, EXPECTED_LEVEL, 'should has default level as EXPECTED_LEVEL after function init')
  t.equal(ll, EXPECTED_LEVEL, 'should has current level as EXPECTED_LEVEL after function init')

  t.end()
})

test('Brolog log level test', t => {
  const log = Brolog
  let l // level

  t.throws(function() {
    log.level('UN_EXIST_LEVEL')
  }, 'should throw Exception when level set to UNKNOWN')

  t.throws(function() {
    log.defaultLevel('UN_EXIST_LEVEL')
  }, 'should throw Exception when defaultLevel set to UNKNOWN')

  log.level('ERR')
  l = log.level()
  t.equal(l, 'ERR', 'should be ERR after level set to ERR')
  // alias
  log.level('ERROR')
  l = log.level()
  t.equal(l, 'ERR', 'should be ERR after level set to ERROR')

  log.level('WARN')
  l = log.level()
  t.equal(l, 'WARN', 'should be WARN after level set to WARN')

  log.level('INFO')
  l = log.level()
  t.equal(l, 'INFO', 'should be INFO after level set to INFO')

  log.level('VERB')
  l = log.level()
  t.equal(l, 'VERB', 'should be ERR after level set to VERB')
  // alias
  log.level('VERBOSE')
  l = log.level()
  t.equal(l, 'VERB', 'should be ERR after level set to VERBOSE')

  log.level('SILL')
  l = log.level()
  t.equal(l, 'SILL', 'should be SILL after level set to SILL')
  // alias
  log.level('SILLY')
  l = log.level()
  t.equal(l, 'SILL', 'should be SILL after level set to SILLY')

  t.end()
})

test('Brolog filter test', t => {
  const log = Brolog

  const funcs = [
    'error'
    , 'warn'
    , 'info'
    , 'log'
  ]
  let counter = {}
  monkeyPatch()

  initCounter()
  log.level('SILENT')
  doLog(log)
  t.equal(counter.error, 0, 'should call error 0 time with level SILENT')
  t.equal(counter.warn, 0, 'should call warn 0 time with level SILENT')
  t.equal(counter.info, 0, 'should call info 0 time with level SILENT')
  t.equal(counter.log, 0, 'should call log(verbose + silly) 0 time with level SILENT')

  initCounter()
  log.level('ERR')
  doLog(log)
  t.equal(counter.error, 1, 'should call error 1 time with level ERR')
  t.equal(counter.warn, 0, 'should call warn 0 time with level ERR')
  t.equal(counter.info, 0, 'should call info 0 time with level ERR')
  t.equal(counter.log, 0, 'should call log(verbose + silly) 0 time with level ERR')

  initCounter()
  log.level('VERBOSE')
  doLog(log)
  t.equal(counter.error, 1, 'should call error 1 time with level VERBOSE')
  t.equal(counter.warn, 1, 'should call warn 1 time with level VERBOSE')
  t.equal(counter.info, 1, 'should call info 1 time with level VERBOSE')
  t.equal(counter.log, 1, 'should call log(verbose + silly) 1 time with level VERBOSE')

  t.end()

  ////////////////////////////////////////////

  function initCounter() {
    counter = {}
    funcs.forEach(f => counter[f] = 0) // init counter
  }

  // XXX should has a monkeyUnPatch to restore.
  // or this test must be the last one
  function monkeyPatch() {
    funcs.forEach(f => {
      console[f + 'Orig'] = console[f]
      console[f] = function() {
        counter[f]++
        // console[f + 'Orig'].apply(console, arguments)
      }
    })
  }

  function doLog(logger) {
    logger.error('Test', 'error message')
    logger.warn('Test', 'warn message')
    logger.info('Test', 'info message')
    logger.verbose('Test', 'verbose message')
    logger.silly('Test', 'silly message')
  }
})
