describe('Brolog Angular App', function() {

  var logSucc = false // whether Brolog log output to console successful

  browser.get('/')

  var EXPECTED_LOG_MESSAGE_RE = /THIS_MESSAGE_MEANS_BROLOG_ANGULAR_GOOD/i

  browser.manage().logs().get('browser').then(function(logsEntries) {
    logsEntries.forEach(item => {
      // console.log('LOG LEVEL:', item.level.name, item.message)
      if (EXPECTED_LOG_MESSAGE_RE.test(item.message)) {
        logSucc = true
      }
    })
  })

  it('should display message saying "Brolog ♥ Angular Demo"', () => {

    var t = element(by.css('h1')).getText()

    expect(1).toEqual(1)
    expect(t).toEqual('Brolog ♥ Angular Demo')

  })

  it('should injected Brolog to Angular with a special message', () => {

    browser.driver.wait(function() {
      // console.log('polling for console.log to appear')
      return logSucc
    }, 10000)

    expect(logSucc).toEqual(true)

  })
})
