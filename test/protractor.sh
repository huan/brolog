#!/bin/bash
set -e # http://stackoverflow.com/a/3474556/1123955

E2E_TESTING_DIR="/tmp/brolog-angular-demo.$$"
GIT_URL="https://github.com/zixia/brolog-angular-demo.git"

npm link
webdriver-manager update

git clone "$GIT_URL" "$E2E_TESTING_DIR"

cd "$E2E_TESTING_DIR"
npm install
npm link brolog
npm start
cd -

# http://stackoverflow.com/a/3474556/1123955
protractor test/protractor.conf.js

cd "$E2E_TESTING_DIR"
npm stop
cd -

rm -fr "$E2E_TESTING_DIR"
