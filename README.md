# brolog  [![Build Status](https://travis-ci.org/zixia/brolog.svg?branch=master)](https://travis-ci.org/zixia/brolog)

Brolog is Logger for Angular in Browser like Npmlog.

[![npm version](https://badge.fury.io/js/brolog.svg)](https://badge.fury.io/js/brolog)
[![TypeScript definitions on DefinitelyTyped](http://definitelytyped.org/badges/standard-flat.svg)](http://definitelytyped.org)

# Feature

1. Out-of-Box Browser Support.(with `<script src='//unpkg.com/brolog'></script>`)
1. Out-of-Box Angular & SystemJS Support.(See: [brolog-angular-demo project](https://github.com/zixia/brolog-angular-demo))
1. Npmlog compatible interface.(i.e. `log.verbose('Brolog', 'Hello, %s', 'world!'')`)
1. Native TypeScript Support.(With types)
1. Node.js Support.([Node.js example](https://github.com/zixia/brolog/blob/master/example/npm-like-logger.js))
1. Support show **real** line number in browser console.
    > What I really get frustrated by is that I cannot wrap console.* and preserve line numbers
    
    [We enabled this in Chrome DevTools via blackboxing a bit ago.](https://gist.github.com/paulirish/c307a5a585ddbcc17242)

# Example

Here's two example:

1. First example to demo easy to use in browser, and how it looks like npmlog.
1. Second example to demo intergrate with angular DI & SystemJS.

## 1. Super Easy to use in Browser

You can enable Brolog in your page by simple add the following `script` tag.

```
<script src="//unpkg.com/brolog"></script>
```

```
<html>
  <head>
    <script src="//unpkg.com/brolog"></script>
  </head>
  <body>
    <h1>Brolog in Browser Demo</h1>
    <script>

      var log = Brolog.instance('verbose')

      log.info('Test', '123 info message')
      log.verbose('Test', '123 verbose message')
      log.silly('Test', '123 silly message(should not appear)')

    </script>
  </body>
</html>
```

Link: [Brolog Live demo](http://zixia.github.io/brolog)

## 2. Quick Setup to use in Angular

`Brolog` is writen mainly for act as a logger with Angular. Here's how to Inject Brolog in Angular.

1. install brolog
  ```
  $ npm install brolog --save
  ```

1. setup SystemJS
  ```
  System.config({
    map: {
      brolog: 'node_modules/brolog/bundles/brolog.js'
    }
  })
  ```

1. import
  ```
  import { Brolog } from 'brolog'
  ```

1. inject to @NgModule
  ```
  providers: [
    Brolog,
  ]
  ```

1. inject to constructor
  ```
  class LogApp {
    constructor(
      private log: Brolog
    ) {}
  }
  ```

1. log
  ```
  class LogApp {
    testLog() {
      this.log.verbose('Brolog', 'test log:%s', 123)
      // this will log to browser console
    }
  }
  ```

More details, please see the `brolog-angular-demo` git repository at [here](https://github.com/zixia/brolog-angular-demo).

Link: [Brolog ♥ Angular Live demo](http://zixia.github.io/brolog)

# Basic Usage

```
import { Brolog } from 'brolog'

const log = new Brolog()

// additional stuff ---------------------------+
// message ----------+                         |
// prefix ----+      |                         |
// level -+   |      |                         |
//        v   v      v                         v
    log.info('fyi', 'I have a kitty cat: %j', myKittyCat)
```

## log.level(newLevel)

* {String} 'silent' | 'error' | 'warn' | 'info' | 'verbose' | 'silly'

The level to display logs at.  Any logs at or above this level will be
displayed.  The special level `silent` will prevent anything from being
displayed ever.

## log\[level](prefix, message, ...)

* `level` {String} The level to emit the message at
* `prefix` {String} A string prefix.  Set to "" to skip.
* `message...` Arguments to `util.format`

Emit a log message at the specified level.

For example,

* log.silly(prefix, message, ...)
* log.verbose(prefix, message, ...)
* log.info(prefix, message, ...)
* log.warn(prefix, message, ...)
* log.error(prefix, message, ...)

# Test

Brolog comes with well test suit to ensure the behaviour is expected.

## Unit Test

```
$ npm run unit
```

Unite Test Suite: [link](https://github.com/zixia/brolog/tree/master/test/unit)

## End to End Test

```
$ npm run e2e
```

End to End Test Suite: [link](https://github.com/zixia/brolog/tree/master/test/e2e)

P.S. runing E2E test is based on *brolog demo project*: [git repository](https://github.com/zixia/brolog-angular-demo)

# Changelog

## V1.1 (May 2017)

1. Support for creating individual instances.(We only have one singleton instance before)

## v1.0 (Apr 2017)

Compatible with AOT & WebPack with Angular v4

1. Rewrite from JavaScript to TypeScript
1. Add UMD/AMD/System Module support

## v0.4 (Mar 2017)

1. added timestamp to log output
1. fix CI back to work
1. added CD to auto deploy source code to NPM after passed CI

## v0.3.7 (Aug 2016)

1. added End to End test with Angular
1. supported include by `script` tag
1. full support unpkg.com

## v0.2.0 (Jul 16 2016)

1. added Unit Test
1. supported Angular Dependience Injection

## v0.1.0 (Jul 14 2016)

1. supported show real line number by set blackbox
1. added TypeScript definition file
1. supported work with SystemJS & Angular

# Reference

1. [JavaScript Modules & Build Tools - YouTube](https://www.youtube.com/watch?v=U4ja6HeBm6s)
2. [Writing Declaration Files](https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html)
3. [Angular Dependency injection tokens](https://angular.io/docs/ts/latest/guide/dependency-injection.html#!#token)
4. [Angular 2 Errors](https://daveceddia.com/angular-2-errors/)
1. [ES6 vs ES2015 - What to call a JavaScript version?](https://bytearcher.com/articles/es6-vs-es2015-name/)
