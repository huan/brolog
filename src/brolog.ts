/*!
 * Brolog JavaScript Library v1.1.0
 * https://github.com/zixia/brolog
 *
 * Copyright Huan LI <zixia@zixia.net>
 * Released under the ISC license
 * https://github.com/zixia/brolog/blob/master/LICENSE
 *
 * Date: 2016-07
 */
export type LogLevelName = 'silent'
                          | 'error'
                          | 'warn'
                          | 'info'
                          | 'verbose'
                          | 'silly'

export type LogLevelTitle = 'ERR'
                          | 'WARN'
                          | 'INFO'
                          | 'VERB'
                          | 'SILL'

export type PrintTextFunc = (text: string) => void

enum LogLevel {
  silent  = 0,
  error   = 1,
  warn    = 2,
  info    = 3,
  verbose = 4,
  silly   = 5,
}

export interface Loggable {
  error   (prefix: string, message: string, ...args: any[]): void
  warn    (prefix: string, message: string, ...args: any[]): void
  info    (prefix: string, message: string, ...args: any[]): void
  verbose (prefix: string, message: string, ...args: any[]): void
  silly   (prefix: string, message: string, ...args: any[]): void
}

export let log: Brolog

export class Brolog implements Loggable {
  private static globalInstance: Brolog
  private static globalLogLevelName: LogLevelName = 'info'
  private static globalPrefix: string | RegExp    = /.*/ // Match all by default

  private enableTimestamp = true
  private logLevel:     LogLevel
  private prefixFilter: RegExp

  public printText: (levelTitle: LogLevelTitle, text: string) => void

  constructor() {
    this.level(Brolog.globalLogLevelName)
    this.prefix(Brolog.globalPrefix)

    this.printText = this.printTextDefault
  }

  /**
   * Create a global Brolog Instance for sharing between modules
   */
  public static instance(
    levelName?: LogLevelName,
    prefix?:    string | RegExp,
  ): Brolog {
    if (!this.globalInstance) {
      this.globalInstance = new Brolog()
    }

    if (levelName) {
      this.globalLogLevelName = levelName
      this.globalInstance.level(levelName)
    }
    if (prefix) {
      this.globalPrefix = prefix
      this.globalInstance.prefix(prefix)
    }

    return this.globalInstance
  }

  public static enableLogging(logSetting: boolean | PrintTextFunc): Brolog {
    return Brolog.instance().enableLogging(logSetting)
  }

  public enableLogging(logSetting: boolean | PrintTextFunc): Brolog {
    this.verbose('Brolog', 'enableLogging(%s)', logSetting)

    // const loggerMethodList = [
    //   'error',
    //   'warn',
    //   'info',
    //   'verbose',
    //   'silly',
    // ]

    if (logSetting === false) {
      this.silly('Brolog', 'enableLogging() disabled')
      // loggerMethodList.forEach(m => {
      //   this[m] =  nullLogger[m]
      // })
      this.printText = function () { /* null logger */ }

    } else if (logSetting === true) {
      this.silly('Brolog', 'enableLogging() enabled: restore Brolog instance')
      // const restore = new Brolog()
      // loggerMethodList.forEach(m => {
      //   this[m] = restore[m]
      // })
      this.printText = this.printTextDefault

    // } else if (typeof log.verbose === 'function') {
    //   this.silly('Brolog', 'enableLogging() enabled: using provided logger')
    //   for (const method of loggerMethodList) {
    //     this[method] = () => {
    //       // In order to compatible with winston,
    //       // we need to change the args from
    //       // brolog.info('Main', 'Hello %s', 'world')
    //       // to
    //       // log.info('Main Hello %s', 'world')
    //       const argList: string[] = Array.from(arguments)
    //       if (argList.length > 1) {
    //         const module = argList.shift()
    //         argList[0] = `${module} ` + argList[0]
    //       }
    //       return Reflect.apply(log[method], log, argList)
    //     }
    //   }

    } else if (typeof logSetting === 'function') {
      this.silly('Brolog', 'enableLogging() enabled: using provided log function')
      this.printText = function (levelTitle: LogLevelTitle, text: string): void {
        logSetting(text)
        return
      }
    } else {
      throw new Error('got invalid logger')
    }

    return this
  }

  public static prefix(filter?: string | RegExp): RegExp {
    if (filter) {
      this.globalPrefix = filter
    }
    return this.instance().prefix(filter)
  }
  public prefix(filter?: string | RegExp): RegExp {
    if (filter) {
      if (typeof filter === 'string') {
        this.prefixFilter = new RegExp(filter, 'i')
      } else if (filter instanceof RegExp) {
        this.prefixFilter = filter
      } else {
        throw new Error('unsupported prefix filter')
      }
    }
    return this.prefixFilter
  }

  public static level(levelName?: LogLevelName): LogLevelName {
    if (levelName) {
      this.globalLogLevelName = levelName
    }
    return this.instance().level(levelName)
  }

  public level(levelName?: LogLevelName) {
    if (levelName) {
      // console.log('levelName: ' + levelName)
      // http://stackoverflow.com/a/21294925/1123955
      // XXX: fix the any here?
      let logLevel = LogLevel[levelName.toLowerCase() as any] as any as LogLevel
      if (logLevel === undefined) { // be aware of number 0 here
        log.error('Brolog', 'level(%s) not exist, set to silly.', levelName)
        logLevel = LogLevel.silly
      }
      this.logLevel = logLevel
    }
    return LogLevel[this.logLevel] as LogLevelName
  }

  private log(levelTitle: LogLevelTitle, prefix: string, message: string) {
    if (!this.prefixFilter.test(prefix)) {
      return  // skip message not match prefix filter
    }

    const args = Array.prototype.slice.call(arguments, 3) || []
    args.unshift(this.timestamp() + levelTitle + ' ' + prefix + ' ' + (message || ''))
    // const args = Array.from(arguments) || []
    // args[0] = this.timestamp() + args[0]

    const text = Reflect.apply(sprintf, null, args)
    this.printText(levelTitle, text)
  }

  public printTextDefault(levelTitle: LogLevelTitle, text: string): void {
    // Use Reflect at:
    // https://www.keithcirkel.co.uk/metaprogramming-in-es6-part-2-reflect/
    switch (levelTitle) {
      case 'ERR':
        // console.error.apply(console, args)
        // Reflect.apply(console.error, console, args)
        console.error(text)
        break
      case 'WARN':
        // console.warn.apply(console, args)
        // Reflect.apply(console.warn, console, args)
        console.warn(text)
        break
      case 'INFO':
        // console.info.apply(console, args)
        // Reflect.apply(console.info, console, args)
        console.info(text)
        break

      default:
      case 'VERB':
      case 'SILL':
        // console.log.apply(console, args)
        // Reflect.apply(console.log, console, args)
        console.log(text)
    }

  }
  public static error(prefix: string, ...args: any[]): void {
    const instance = Brolog.instance()
    // return instance.error.apply(instance, arguments)
    return Reflect.apply(instance.error, instance, arguments)
  }
  public error(prefix: string, ...args: any[]): void {
    if (this.logLevel < LogLevel.error) {
      return
    }
    const argList = Array.from(arguments)
    argList.unshift('ERR')
    // this.log.apply(this, argList)
    return Reflect.apply(this.log, this, argList)
  }

  public static warn(prefix: string, ...args: any[]): void {
    const instance = Brolog.instance()
    // return instance.warn.apply(instance, arguments)
    return Reflect.apply(instance.warn, instance, arguments)
  }
  public warn(prefix: string, ...args: any[]): void {
    if (this.logLevel < LogLevel.warn) {
      return
    }
    const argList = Array.from(arguments)
    argList.unshift('WARN')
    // return this.log.apply(this, argList)
    return Reflect.apply(this.log, this, argList)
  }

  public static info(prefix: string, ...args: any[]): void {
    const instance = Brolog.instance()
    // return instance.info.apply(instance, arguments)
    return Reflect.apply(instance.info, instance, arguments)
  }
  public info(prefix: string, ...args: any[]): void {
    if (this.logLevel < LogLevel.info) {
      return
    }
    const argList = Array.from(arguments)
    argList.unshift('INFO')
    // this.log.apply(this, argList)
    return Reflect.apply(this.log, this, argList)
  }

  public static verbose(prefix: string, ...args: any[]): void {
    const instance = Brolog.instance()
    // return instance.verbose.apply(instance, arguments)
    return Reflect.apply(instance.verbose, instance, arguments)
  }
  public verbose(prefix: string, ...args: any[]): void {
    if (this.logLevel < LogLevel.verbose) {
      return
    }

    const argList = Array.from(arguments)
    argList.unshift('VERB')
    // this.log.apply(this, argList)
    return Reflect.apply(this.log, this, argList)
  }

  public static silly(prefix: string, ...args: any[]): void {
    const instance = Brolog.instance()
    // return instance.silly.apply(instance, arguments)
    return Reflect.apply(instance.silly, instance, arguments)
  }
  public silly(prefix: string, ...args: any[]): void {
    if (this.logLevel < LogLevel.silly) {
      return
    }
    const argList = Array.from(arguments)
    argList.unshift('SILL')
    // this.log.apply(this, argList)
    return Reflect.apply(this.log, this, argList)
  }

  public timestamp(enable: boolean): void
  public timestamp(): string

  public timestamp(enable?: boolean): string | void {
    if (typeof enable === 'boolean') {
      this.enableTimestamp = enable
      return
    }

    if (!this.enableTimestamp) {
      return ''
    }

    const date  = new Date()
    const hour    = date.getHours()
    const min     = date.getMinutes()
    const sec     = date.getSeconds()

    let stampStr = ''

    stampStr += (hour < 10) ? ('0' + hour)  : hour
    stampStr += ':'
    stampStr += (min < 10)  ? ('0' + min)   : min
    stampStr += ':'
    stampStr += (sec < 10)  ? ('0' + sec)   : sec

    return stampStr + ' '
  }
}

// Credit: https://stackoverflow.com/a/4795914/1123955
function sprintf() {
  const args = arguments
  const text = args[0]
  let i = 1
  return text.replace(/%((%)|s|d)/g, function (m) {
      // m is the matched format, e.g. %s, %d
      let val = null as any
      if (m[2]) {
          val = m[2];
      } else {
          val = args[i];
          // A switch statement so that the formatter can be extended. Default is %s
          switch (m) {
              case '%d':
                  val = parseFloat(val)
                  if (isNaN(val)) {
                      val = 0
                  }
                  break
          }
          i++
      }
      return val
  })
}

log = Brolog.instance()
export default Brolog
