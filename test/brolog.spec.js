'use strict'

const test = require('tap').test

const Brolog = require('..')

test('conlog smoking test', t => {

  var logClass = Brolog.factory('INFO')
  t.equal(typeof logClass, 'function', 'should return a function class when we call Brolog as factory')

  var log = new logClass()
  t.equal(typeof log, 'function', 'should still return function when we call new Brolog as class')

  var l = log.level()
  t.equal(l, 'INFO', 'should has default level INFO')

  log.error('Test', 'error log %s', 'ok')
  log.silly('Test', 'silly log %s', 'ok')

  log.level('ERR')
  l = log.level()
  t.equal(l, 'ERR', 'should be ERR after level set to ERR')

  log.level('ERROR')
  l = log.level()
  t.equal(l, 'ERR', 'should be ERR after level set to ERROR')

  log.error('Test', 'error log %s', 'ok')
  log.silly('Test', 'silly log %s', 'ok')

  t.end()
})