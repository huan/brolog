const Brolog = require('..')

console.log(typeof Brolog)

const logClass = Brolog('SILLY')

console.log(typeof logClass)

const log = new logClass()

console.log(typeof log)

function demo() {

  console.log('#### Set Level to SILLY ####')
  log.level('SILLY')
  doLog()

  log.level('INFO')
  console.log('#### Set Level to INFO ####')
  doLog()

  console.log('#### Set Level to ERR ####')
  log.level('ERR')
  doLog()

  console.log('#### Set Level to SILENT ####')
  log.level('SILENT')
  doLog()

  console.log('#### BroLog Test Done ####')

}

function doLog() {
  log.error('LogApp', 'error')
  log.warn('LogApp', 'warn')
  log.info('LogApp', 'info')
  log.verbose('LogApp', 'verbose')
  log.silly('LogApp', 'silly')
}

demo()
