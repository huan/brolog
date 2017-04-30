/*!
 * Brolog JavaScript Library v0.2.0
 * https://github.com/zixia/brolog
 *
 * Copyright Zhuohuan LI <zixia@zixia.net>
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

export enum LogLevel {
  silent  = 0,
  error   = 1,
  warn    = 2,
  info    = 3,
  verbose = 4,
  silly   = 5,
}

export class Brolog {
  static logLevel = LogLevel.info

  constructor() {
    // console.log('constructor')
  }

  static instance(levelName?: LevelName): Brolog {
    Brolog.level(levelName)
    return singleton
  }

  level(levelName?: LevelName) { return Brolog.level(levelName) }
  static level(levelName?: LevelName): LevelName {
    if (levelName) {
      // console.log('levelName: ' + levelName)
      // http://stackoverflow.com/a/21294925/1123955
      // XXX: fix the any here?
      const logLevel = LogLevel[levelName as any] as any
      if (logLevel === undefined) { // be aware of number 0 here
        // console.log(logLevel)
        // console.log(LogLevel)
        throw new Error('level name error')
      }
      Brolog.logLevel = logLevel
    }
    return LogLevel[Brolog.logLevel] as LevelName
  }

  log(levelTitle: LevelTitle, prefix: string, message: string) { return Brolog.log(levelTitle, prefix, message) }
  static log(levelTitle: LevelTitle, prefix: string, message: string) {
    var args = Array.prototype.slice.call(arguments, 3) || []
    args.unshift(Brolog.timestamp() + ' ' + levelTitle + ' ' + prefix + ' ' + (message || ''))

    switch (levelTitle) {
      case 'ERR':
        console.error.apply(console, args)
        break
      case 'WARN':
        console.warn.apply(console, args)
        break
      case 'INFO':
        console.info.apply(console, args)
        break

      default:
      case 'VERB':
      case 'SILL':
        console.log.apply(console, args)
    }
  }

  error(prefix: string, ...args: any[]): void { return Brolog.error.apply(null, arguments)}
  static error(prefix: string, ...args: any[]): void {
    if (Brolog.logLevel < LogLevel.error) {
      return
    }

    const argList = Array.prototype.slice.call(arguments)
    argList.unshift('ERR')
    Brolog.log.apply(null, argList)
  }

  warn(prefix: string, ...args: any[]): void { return Brolog.warn.apply(null, arguments)}
  static warn(prefix: string, ...args: any[]): void {
    if (Brolog.logLevel < LogLevel.warn) {
      return
    }

    const argList = Array.prototype.slice.call(arguments)
    argList.unshift('WARN')
    Brolog.log.apply(null, argList)
  }

  info(prefix: string, ...args: any[]): void { return Brolog.info.apply(null, arguments)}
  static info(prefix: string, ...args: any[]): void {
    if (Brolog.logLevel < LogLevel.info) {
      return
    }

    const argList = Array.prototype.slice.call(arguments)
    argList.unshift('INFO')
    Brolog.log.apply(null, argList)
  }

  verbose(prefix: string, ...args: any[]): void { return Brolog.verbose.apply(null, arguments)}
  static verbose(prefix: string, ...args: any[]): void {
    if (Brolog.logLevel < LogLevel.verbose) {
      return
    }

    const argList = Array.prototype.slice.call(arguments)
    argList.unshift('VERB')
    Brolog.log.apply(null, argList)
  }

  silly(prefix: string, ...args: any[]): void { return Brolog.silly.apply(null, arguments)}
  static silly(prefix: string, ...args: any[]): void {
    if (Brolog.logLevel < LogLevel.silly) {
      return
    }

    const argList = Array.prototype.slice.call(arguments)
    argList.unshift('SILL')
    Brolog.log.apply(null, argList)
  }

  static timestamp() {
    const date  = new Date()
    let hour    = date.getHours()
    let min     = date.getMinutes()
    let sec     = date.getSeconds()

    let stampStr = ''

    stampStr += (sec < 10)  ? ('0' + sec)   : sec
    stampStr += ':'
    stampStr += (min < 10)  ? ('0' + min)   : min
    stampStr += ':'
    stampStr += (hour < 10) ? ('0' + hour)  : hour

    return stampStr
  }
}

export const singleton = new Brolog()

export default singleton
