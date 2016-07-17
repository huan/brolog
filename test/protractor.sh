#!/bin/bash

APP_DIR="/tmp/brolog-angular-demo.$$"

npm link
webdriver-manager update

git clone git@github.com:zixia/brolog-angular-demo.git "$APP_DIR"
cd "$APP_DIR"
npm install
npm link brolog
npm start
cd -

protractor test/protractor.conf.js
if [ $? -ne 0 ]; then
	exit $?
fi

cd "$APP_DIR"
npm stop
cd -

rm -fr "$APP_DIR"
