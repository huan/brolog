// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js

import { SpecReporter } from 'jasmine-spec-reporter'
import * as puppeteer   from 'puppeteer'

import { Config } from 'protractor'

/*global jasmine */
declare const jasmine: any

export const config: Config = {
  allScriptsTimeout: 11000,
  specs: [
    'e2e/**/*.e2e-spec.js',
  ],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: process.env.HEADLESS
        ? ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
        : [],
      binary: process.env.HEADLESS ? puppeteer.executablePath() : undefined,
    },
  },
  directConnect: true,
  baseUrl: 'http://localhost:3000',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 11000,
    print: function() {
      //
    },
  },
  useAllAngular2AppRoots: true,
  beforeLaunch: function() {
    //
  },
  onPrepare: function() {
    jasmine.getEnv().addReporter(new SpecReporter())
  },
}

console.log(JSON.stringify(exports.config, null, '  '))
