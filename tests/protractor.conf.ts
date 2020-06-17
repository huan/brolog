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
    directConnect: true,
    browserName: 'chrome',
    /**
     * Huan(202006): How to use Protractor with Puppeteer? #4695
     *  https://github.com/angular/protractor/issues/4695#issuecomment-364039288
     */
    chromeOptions: {
      args: [
        '--headless',
        '--no-sandbox',
        '--disable-dev-shm-usage',
      ],
      binary: puppeteer.executablePath(),
    },
  },
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
