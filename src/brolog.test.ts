/**
 * Unit tests for Brolog: leveled logging, instance creation, level filters,
 * prefix matching, text printer overrides, and timestamp formatting.
 */
import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  Brolog,
  VERSION,
} from './brolog.ts'
import type {
  Logger,
} from './logger.ts'

interface ConsoleCounts {
  error: number
  warn: number
  info: number
  log: number
}

function captureConsole () {
  const counts: ConsoleCounts = {
    error: 0,
    warn: 0,
    info: 0,
    log: 0,
  }
  const orig = {
    error: console.error,
    warn: console.warn,
    info: console.info,
    log: console.log,
  }

  console.error = () => { counts.error += 1 }
  console.warn  = () => { counts.warn  += 1 }
  console.info  = () => { counts.info  += 1 }
  console.log   = () => { counts.log   += 1 }

  return {
    counts,
    restore: () => {
      console.error = orig.error
      console.warn = orig.warn
      console.info = orig.info
      console.log = orig.log
    },
  }
}

test('VERSION format check', () => {
  assert.ok(/^\d+\.\d+\.\d+$/.test(VERSION), 'should get semver VERSION')
})

test('Brolog static/instance construct test', () => {
  const EXPECTED_LEVEL = 'silly'
  const log = Brolog.instance('info')

  let l = Brolog.level()
  assert.equal(l, 'info', 'should have default level `info`')

  l = Brolog.level(EXPECTED_LEVEL)
  assert.equal(l, EXPECTED_LEVEL, 'should be EXPECTED_LEVEL after setlevel to it')

  const logInstance = Brolog.instance(EXPECTED_LEVEL)
  assert.equal(typeof logInstance, 'object', 'should return an object class when we call Brolog as instance')
  assert.equal(logInstance, log, 'should return a instance as default exported log')

  let ll = log.level()
  assert.equal(ll, EXPECTED_LEVEL, 'should have current level as EXPECTED_LEVEL after factory & class init')

  const LEVEL_SILENT = 'silent'
  const log1 = new Brolog()
  log1.level(LEVEL_SILENT)
  ll = log1.level()
  assert.equal(ll, LEVEL_SILENT, 'should have current level as LEVEL_SILENT after function init')
})

test('Brolog global log level test', () => {
  const log = Brolog
  log.level('UN_EXIST_LEVEL' as any)
  assert.equal(log.level(), 'silly', 'should set level to SILLY when level set to UNKNOWN')

  log.level('error')
  assert.equal(log.level(), 'error', 'should be ERR after level set to `error`')

  log.level('warn')
  assert.equal(log.level(), 'warn', 'should be warn after level set to `warn`')

  log.level('info')
  assert.equal(log.level(), 'info', 'should be info after level set to `info`')

  log.level('verbose')
  assert.equal(log.level(), 'verbose', 'should be verbose after level set to `verbose`')

  log.level('silly')
  assert.equal(log.level(), 'silly', 'should be silly after level set to silly')
})

test('Brolog global instance level filter test', () => {
  function doLog (logger: any) {
    logger.error('Test', 'error message')
    logger.warn('Test', 'warn message')
    logger.info('Test', 'info message')
    logger.verbose('Test', 'verbose message')
    logger.silly('Test', 'silly message')
  }

  // Silent
  const log2 = Brolog.instance('silent')
  let cap = captureConsole()
  doLog(log2)
  assert.equal(cap.counts.error, 0, 'should not call error with level SILENT')
  cap.restore()

  // Silly
  log2.level('silly')
  cap = captureConsole()
  doLog(log2)
  assert.equal(cap.counts.log, 2, 'should call log2(verbose + silly) 2 times with level SILLY')
  cap.restore()

  // Error
  log2.level('error')
  cap = captureConsole()
  doLog(log2)
  assert.equal(cap.counts.error, 1, 'should call error 1 time with level ERR')
  assert.equal(cap.counts.warn, 0, 'should call warn 0 time with level ERR')
  assert.equal(cap.counts.info, 0, 'should call info 0 time with level ERR')
  assert.equal(cap.counts.log, 0, 'should call log 0 time with level ERR')
  cap.restore()

  // Verbose
  log2.level('verbose')
  cap = captureConsole()
  doLog(log2)
  assert.equal(cap.counts.error, 1, 'should call error 1 time with level VERBOSE')
  assert.equal(cap.counts.warn, 1, 'should call warn 1 time with level VERBOSE')
  assert.equal(cap.counts.info, 1, 'should call info 1 time with level VERBOSE')
  assert.equal(cap.counts.log, 1, 'should call log 1 time with level VERBOSE')
  cap.restore()
})

test('Brolog global instance prefix filter test', () => {
  function doLogHide (logger: Logger) {
    logger.error('Hide', 'error message')
    logger.warn('Hide', 'warn message')
    logger.info('Hide', 'info message')
    logger.verbose('Hide', 'verbose message')
    logger.silly('Hide', 'silly message')
  }

  function doLogShow (logger: Logger) {
    logger.error('Show', 'error message')
    logger.warn('Show', 'warn message')
    logger.info('Show', 'info message')
    logger.verbose('Show', 'verbose message')
    logger.silly('Show', 'silly message')
  }

  const log = Brolog.instance('info', /Show/)

  // Hide should not log
  let cap = captureConsole()
  doLogHide(log)
  assert.equal(cap.counts.error, 0)
  assert.equal(cap.counts.warn, 0)
  assert.equal(cap.counts.info, 0)
  assert.equal(cap.counts.log, 0)
  cap.restore()

  // Show should log up to info
  cap = captureConsole()
  doLogShow(log)
  assert.equal(cap.counts.error, 1)
  assert.equal(cap.counts.warn, 1)
  assert.equal(cap.counts.info, 1)
  assert.equal(cap.counts.log, 0)
  cap.restore()

  // Silent with Show prefix
  log.level('silent')
  cap = captureConsole()
  doLogShow(log)
  assert.equal(cap.counts.error, 0)
  cap.restore()

  // Silly with Show prefix
  log.level('silly')
  cap = captureConsole()
  doLogShow(log)
  assert.equal(cap.counts.error, 1)
  assert.equal(cap.counts.warn, 1)
  assert.equal(cap.counts.info, 1)
  assert.equal(cap.counts.log, 2)
  cap.restore()
})

test('Brolog individual instance prefix filter test', () => {
  const log = Brolog.instance('info', /.*/)

  assert.equal(log.level(), 'info', 'should be global level `info`')
  assert.equal(log.prefix().toString(), '/.*/', 'should be global prefix filter /.*/')

  const log1 = new Brolog()
  const log2 = new Brolog()

  log2.level('silly')
  log2.prefix('faint')

  assert.notEqual(log1, log, 'should not be the same as global instance')
  assert.notEqual(log1, log2, 'should not be the same between new instances')

  assert.equal(log1.level(), 'info', 'should stick with default level `info`')
  assert.equal(log1.prefix().toString(), '/.*/', 'should stick with default prefix filter by default')

  assert.equal(log2.level(), 'silly', 'should be set level `silly`')
  assert.equal(log2.prefix().toString(), '/^faint$/', 'should be set prefix filter to /faint/')
})

test('Brolog enableLogger()', () => {
  let stubCount = 0
  const origPrinter = Brolog.prototype.defaultTextPrinter
  Brolog.prototype.defaultTextPrinter = () => { stubCount++ }

  try {
    const log = Brolog.enableLogging(false)
    log.error('TEST', 'Should not log')
    assert.equal(stubCount, 0, 'should not log anything after enableLogging(false)')

    log.enableLogging(true)
    stubCount = 0
    log.error('TEST', 'Should log')
    assert.equal(stubCount, 1, 'should log after enableLogging(true)')

    let spyCount = 0
    const spy = () => { spyCount++ }
    log.enableLogging(spy)
    stubCount = 0
    log.error('TEST', 'should call spy')
    assert.equal(stubCount, 0, 'should not call defaultTextPrinter')
    assert.equal(spyCount, 1, 'should call spy after enableLogging(spy)')
  } finally {
    Brolog.prototype.defaultTextPrinter = origPrinter
  }
})

test('Timestamp()', () => {
  const log = new Brolog()
  assert.ok(log.timestamp(), 'should enable timestamp by default')

  assert.equal(log.timestamp(false), undefined, 'should return void when set timestamp to false')
  assert.equal(log.timestamp(), '', 'should return empty string when timestamp is disabled')

  assert.equal(log.timestamp(true), undefined, 'should return void when set timestamp to true')
  assert.ok(log.timestamp(), 'should return timestamp string when timestamp is enabled')
})

test('version()', () => {
  const log = new Brolog()
  assert.ok(log.version(), 'should get version')
})

test('non-string messages are logged instead of throwing', () => {
  const lines: string[] = []
  const logger = new Brolog()
  logger.level('silly')
  logger.prefix(/.*/)
  logger.timestamp(false)
  logger.textPrinter = (_title, text) => {
    lines.push(text)
  }

  logger.error('Example', new Error('failure'))
  logger.info('Example', 42)
  logger.info('Example', 0)
  logger.warn('Example', { code: 7 })
  logger.verbose('Example', 'count %d', 3)
  logger.silly('Example', 'failed: %s', new Error('boom'))
  logger.error('Example')

  assert.deepEqual(lines, [
    'ERR Example Error: failure',
    'INFO Example 42',
    'INFO Example 0',
    'WARN Example [object Object]',
    'VERB Example count 3',
    'SILL Example failed: Error: boom',
    'ERR Example',
  ])
})
