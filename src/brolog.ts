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

export type LevelName = 'silent'
                      | 'error'
                      | 'warn'
                      | 'info'
                      | 'verbose'
                      | 'silly'

export type LevelTitle = 'ERR'
                      | 'WARN'
                      | 'INFO'
                      | 'VERB'
                      | 'SILL'

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

export const nullLogger: Loggable = {
  error()   { /* null */ },
  warn()    { /* null */ },
  info()    { /* null */ },
  verbose() { /* null */ },
  silly()   { /* null */ },
}

export class Brolog implements Loggable {
  public static globalInstance: Brolog

  private enableTimestamp = true
  private logLevel        = LogLevel.info
  private prefixFilter    = /.*/ // Match all by default

  constructor() {
    if (Brolog.globalInstance) { // skip the first init, which is for the globalInstance itself
      // set level/prefix of this instance
      // default to the global instance
      this.level(Brolog.globalInstance.level())
      this.prefix(Brolog.globalInstance.prefix())
    }
  }

  /**
   * Create a global Brolog Instance for sharing between modules
   */
  public static instance(
    levelName?: LevelName,
    prefix?:    string | RegExp,
  ): Brolog {
    if (!this.globalInstance) {
      this.globalInstance = new Brolog()
    }
    if (levelName) {
      this.globalInstance.level(levelName)
    }
    if (prefix) {
      this.globalInstance.prefix(prefix)
    }

    return this.globalInstance
  }

  public static enableLogging(log: boolean | Loggable): Loggable {
    Brolog.instance().verbose('Brolog', 'enableLogging(%s)', log)

    if (log === false) {
      Brolog.instance().silly('Brolog', 'enableLogging() disabled')

      return nullLogger

    } else if (log === true) {
      Brolog.instance().silly('Brolog', 'enableLogging() enabled: using blobal Brolog instance')

      return Brolog.instance()

    } else if (typeof log.verbose === 'function') {
      Brolog.instance().silly('Brolog', 'enableLogging() enabled: using provided logger')
      return log
    }

    throw new Error('got invalid logger')
  }

  public static prefix(filter?: string | RegExp): RegExp {
    return Brolog.instance().prefix(filter)
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

  public static level(levelName?: LevelName): LevelName {
    return Brolog.instance().level(levelName)
  }
  public level(levelName?: LevelName) {
    if (levelName) {
      // console.log('levelName: ' + levelName)
      // http://stackoverflow.com/a/21294925/1123955
      // XXX: fix the any here?
      const logLevel = LogLevel[levelName.toLowerCase() as any] as any
      if (logLevel === undefined) { // be aware of number 0 here
        // console.log(logLevel)
        // console.log(LogLevel)
        throw new Error('level name error')
      }
      this.logLevel = logLevel
    }
    return LogLevel[this.logLevel] as LevelName
  }

  // private log(levelTitle: LevelTitle, prefix: string, message: string) { return Brolog.log(levelTitle, prefix, message) }
  private log(levelTitle: LevelTitle, prefix: string, message: string) {
    if (!this.prefixFilter.test(prefix)) {
      return  // skip message not match prefix filter
    }

    const args = Array.prototype.slice.call(arguments, 3) || []
    args.unshift(this.timestamp() + levelTitle + ' ' + prefix + ' ' + (message || ''))

    // Use Reflect at:
    // https://www.keithcirkel.co.uk/metaprogramming-in-es6-part-2-reflect/
    switch (levelTitle) {
      case 'ERR':
        // console.error.apply(console, args)
        Reflect.apply(console.error, console, args)
        break
      case 'WARN':
        // console.warn.apply(console, args)
        Reflect.apply(console.warn, console, args)
        break
      case 'INFO':
        // console.info.apply(console, args)
        Reflect.apply(console.info, console, args)
        break

      default:
      case 'VERB':
      case 'SILL':
        // console.log.apply(console, args)
        Reflect.apply(console.log, console, args)
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
    const argList = Array.prototype.slice.call(arguments)
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
    const argList = Array.prototype.slice.call(arguments)
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
    const argList = Array.prototype.slice.call(arguments)
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

    const argList = Array.prototype.slice.call(arguments)
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
    const argList = Array.prototype.slice.call(arguments)
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

export const log = Brolog.instance()
export default log
