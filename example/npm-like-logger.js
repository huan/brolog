const Brolog = require('..')

const logClass = Brolog('SILLY')
const log = new logClass()

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
