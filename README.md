# brolog  [![Build Status](https://travis-ci.org/zixia/brolog.svg?branch=master)](https://travis-ci.org/zixia/brolog)

Npmlog like Logger for Angular in Browser

This logger simulate the basic npmlog behaviour.

[![npm version](https://badge.fury.io/js/brolog.svg)](https://badge.fury.io/js/brolog)

# Feature

1. Support import with TypeScript. (typing file [index.d.ts](https://github.com/zixia/brolog/blob/master/index.d.ts))
1. Support Angular2 & SystemJS. (demo project [git repository](https://github.com/zixia/brolog-angular-demo))
1. Support show **real** line number in browser console.
    > What I really get frustrated by is that I cannot wrap console.* and preserve line numbers

    [We enabled this in Chrome DevTools via blackboxing a bit ago.](https://gist.github.com/paulirish/c307a5a585ddbcc17242)
1. Certainly it can run under nodejs. (Just for test & fun. example [here](https://github.com/zixia/brolog/blob/master/example/npm-like-logger.js))

# Work with Angular

`Brolog` is writen mainly for act as a logger with Angular. Here's how to Inject Brolog in Angular.

1. install brolog  
  ```shell
  $ npm install brolog --save
  ```
1. setup SystemJS  
    ```javascript
    System.config({
      map: {
        brolog: 'node_modules/brolog/index.js'
      }
    })
    ```
1. import  
    ```javascript
    import { Brolog } from 'brolog'
    ```
1. inject to bootstrap  
    ```javascript
    bootstrap(LogApp, [
      Brolog.factory('VERBOSE')
    ])
    ```
1. inject to constructor  
    ```javascript
    class LogApp {
      constructor(
        @Inject(Brolog) private log
      ) {
      }
    }
    ```
1. log  
    ```javascript
    class LogApp {
      testLog() {
        this.log.verbose('Brolog', 'test log %d', 123)
        // this will log to browser console
      }
    }
    ```

More details, please see the `brolog-angular-demo` git repository [here](https://github.com/zixia/brolog-angular-demo).

# Basic Usage

```
var log = require('brolog')

// additional stuff ---------------------------+
// message ----------+                         |
// prefix ----+      |                         |
// level -+   |      |                         |
//        v   v      v                         v
    log.info('fyi', 'I have a kitty cat: %j', myKittyCat)
```

## log.level()

* {String}

The level to display logs at.  Any logs at or above this level will be
displayed.  The special level `silent` will prevent anything from being
displayed ever.

## log.log(level, prefix, message, ...)

* `level` {String} The level to emit the message at
* `prefix` {String} A string prefix.  Set to "" to skip.
* `message...` Arguments to `util.format`

Emit a log message at the specified level.

## log\[level](prefix, message, ...)

For example,

* log.silly(prefix, message, ...)
* log.verbose(prefix, message, ...)
* log.info(prefix, message, ...)
* log.warn(prefix, message, ...)
* log.error(prefix, message, ...)

Like `log.log(level, prefix, message, ...)`.  In this way, each level is
given a shorthand, so you can do `log.info(prefix, message)`.

# Line Number

https://gist.github.com/paulirish/c307a5a585ddbcc17242
http://stackoverflow.com/questions/11308239/console-log-wrapper-that-keeps-line-numbers-and-supports-most-methods


# Reference

1. [JavaScript Modules & Build Tools - YouTube](https://www.youtube.com/watch?v=U4ja6HeBm6s)
2. [Writing Declaration Files](https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html)
