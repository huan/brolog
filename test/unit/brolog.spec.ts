#!/usr/bin/env ts-node

'use strict'

const { test } = require('tap')

import * as sinon from 'sinon'
import * as sinonTest from 'sinon-test'
// const sinon     = require('sinon')
// const sinonTest = require('sinon-test')

sinon.test      = sinonTest.configureTest(sinon)
sinon.testCase  = sinonTest.configureTestCase(sinon)

import { Brolog } from '../../dist/'
import log from '../../dist/'

test('Brolog factory/service/function init test', (t: any) => {

  const EXPECTED_LEVEL = 'silly'

  /**
   *
   * Raw
   *
   */
  var l = Brolog.level()
  t.equal(l, 'info', 'should has default level `info`')

  l = Brolog.level(EXPECTED_LEVEL)
  t.equal(l, EXPECTED_LEVEL, 'should be EXPECTED_LEVEL after setlevel to it')

  /**
   *
   * Instance
   *
   */
  var LogInstance = Brolog.instance(EXPECTED_LEVEL)
  t.equal(typeof LogInstance, 'object', 'should return a object class when we call Brolog as instance')
  t.equal(LogInstance, log, 'should return a instance as default exported log')

  var ll = log.level()
  t.equal(ll, EXPECTED_LEVEL, 'should has current level as EXPECTED_LEVEL after factory & class init')

  /**
   *
   * Constructor
   *
   */
  const LEVEL_SILENT = 'silent'
  const log1 = new Brolog()
  Brolog.level(LEVEL_SILENT)
  ll = log1.level()
  t.equal(ll, LEVEL_SILENT, 'should has current level as LEVEL_SILENT after function init')

  t.end()
})

test('Brolog log level test', t => {
  const log = Brolog
  let l // level

  t.throws(function() {
    log.level('UN_EXIST_LEVEL' as any)
  }, 'should throw Exception when level set to UNKNOWN')

  log.level('error')
  l = log.level()
  t.equal(l, 'error', 'should be ERR after level set to `error`')

  log.level('warn')
  l = log.level()
  t.equal(l, 'warn', 'should be warn after level set to `warn`')

  log.level('info')
  l = log.level()
  t.equal(l, 'info', 'should be info after level set to `info`')

  log.level('verbose')
  l = log.level()
  t.equal(l, 'verbose', 'should be verbose after level set to `verbose`')

  log.level('silly')
  l = log.level()
  t.equal(l, 'silly', 'should be silly after level set to silly')

  t.end()
})

/**
 *
 * This test must be the last one,
 * because monkey patch is not recover when it finish
 *
 */
test('Brolog filter test', t => {
  const logFuncList = [
    'error'
    , 'warn'
    , 'info'
    , 'log'
  ]

  let log2: Brolog

  log2 = Brolog.instance('silent')
  sinon.test(function() {
    logFuncList.forEach(logFunc => this.stub(console, logFunc))
    doLog(log2)
    t.ok(console.error['notCalled'], 'should not call error with level SILENT ##############')
  }).apply(log2)

  log2 = Brolog.instance('silly')
  sinon.test(function() {
    logFuncList.forEach(logFunc => this.stub(console, logFunc))
    doLog(log2)
    t.equal(console.log['callCount'], 2, 'should call log2(verbose + silly) 2 time with level SILLY')
  }).apply(log2)

  log2 = log
  log2.level('silent')
  sinon.test(function() {
    logFuncList.forEach(logFunc => this.stub(console, logFunc))
    doLog(log2)
    t.equal(console.error['callCount'] , 0, 'should call error 0 time with level SILENT')
    t.equal(console.warn['callCount']  , 0, 'should call warn 0 time with level SILENT')
    t.equal(console.info['callCount']  , 0, 'should call info 0 time with level SILENT')
    t.equal(console.log['callCount']   , 0, 'should call log2(verbose + silly) 0 time with level SILENT')
  }).apply(log2)

  log2.level('error')
  sinon.test(function() {
    logFuncList.forEach(logFunc => this.stub(console, logFunc))
    doLog(log2)
    t.equal(console.error['callCount'] , 1, 'should call error 1 time with level ERR')
    t.equal(console.warn['callCount']  , 0, 'should call warn 0 time with level ERR')
    t.equal(console.info['callCount']  , 0, 'should call info 0 time with level ERR')
    t.equal(console.log['callCount']   , 0, 'should call log2(verbose + silly) 0 time with level ERR')
  }).apply(log2)

  log2.level('verbose')

  sinon.test(function() {
    logFuncList.forEach(logFunc => this.stub(console, logFunc))
    doLog(log2)
    t.equal(console.error['callCount'] , 1, 'should call error 1 time with level VERBOSE')
    t.equal(console.warn['callCount']  , 1, 'should call warn 1 time with level VERBOSE')
    t.equal(console.info['callCount']  , 1, 'should call info 1 time with level VERBOSE')
    t.equal(console.log['callCount']   , 1, 'should call log2(verbose + silly) 1 time with level VERBOSE')
  }).apply(log2)

  t.end()

  ////////////////////////////////////////////
  function doLog(logger) {
    logger.error('Test', 'error message')
    logger.warn('Test', 'warn message')
    logger.info('Test', 'info message')
    logger.verbose('Test', 'verbose message')
    logger.silly('Test', 'silly message')
  }
})
