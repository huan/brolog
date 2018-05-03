const { Brolog } = require('brolog')

const log = new Brolog()

function demo() {

  console.log('#### Set Level to SILLY ####')
  log.level('silly')
  doLog()

  log.level('info')
  console.log('#### Set Level to INFO ####')
  doLog()

  console.log('#### Set Level to ERR ####')
  log.level('error')
  doLog()

  console.log('#### Set Level to SILENT ####')
  log.level('silent')
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
