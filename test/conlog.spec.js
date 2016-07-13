const test = require('tap').test

const conlog = require('..')

test('conlog smoking test', t => {

  let l = conlog.level()
  t.equal(l, conlog.LEVELS.INFO, 'should has default level INFO')

  conlog.error('Test', 'error log %s', 'ok')
  conlog.silly('Test', 'silly log %s', 'ok')

  conlog.level('ERR')
  l = conlog.level()
  t.equal(l, conlog.LEVELS.ERR, 'should be ERR after level set to ERR')

  conlog.level('ERROR')
  l = conlog.level()
  t.equal(l, conlog.LEVELS.ERR, 'should be ERR after level set to ERROR')

  conlog.error('Test', 'error log %s', 'ok')
  conlog.silly('Test', 'silly log %s', 'ok')

  t.end()
})