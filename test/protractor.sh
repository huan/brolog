#!/bin/bash
set -e # http://stackoverflow.com/a/3474556/1123955

APP_DIR="/tmp/brolog-angular-demo.$$"
GIT_URL="https://github.com/zixia/brolog-angular-demo.git"

npm link
webdriver-manager update

git clone "$GIT_URL" "$APP_DIR"
cd "$APP_DIR"
npm install
npm link brolog
npm start
cd -

kill 4312432
# http://stackoverflow.com/a/3474556/1123955
protractor test/protractor.conf.js

cd "$APP_DIR"
npm stop
cd -

rm -fr "$APP_DIR"
