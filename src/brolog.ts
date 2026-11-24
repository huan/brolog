/**
 * Brolog logger implementation: leveled, filtered, and timestamped console logging
 * with zero external runtime dependencies for browser, Node.js, and Deno environments.
 */
import {
  VERSION,
  BROLOG_LEVEL,
  BROLOG_PREFIX,
}                 from './config.ts'

import type {
  Logger,
}                 from './logger.ts'

type LogLevelTitle =
  | 'ERR'
  | 'WARN'
  | 'INFO'
  | 'VERB'
  | 'SILL'

type TextPrinterFunction = (title: string, text?: string) => void

const LogLevel = {
  silent  : 0,
  error   : 1,
  warn    : 2,
  info    : 3,
  verbose : 4,
  silly   : 5,
} as const

type LogLevel = typeof LogLevel[keyof typeof LogLevel]
type LogLevelName = keyof typeof LogLevel

const LogLevelNames: Record<number, LogLevelName> = {
  0: 'silent',
  1: 'error',
  2: 'warn',
  3: 'info',
  4: 'verbose',
  5: 'silly',
}

class Brolog implements Logger {

  private static globalInstance?  : Brolog
  private static globalLogLevelName: LogLevelName     = 'info'
  private static globalPrefix      : string | RegExp  = /.*/  // Match all by default

  private enableTimestamp = true
  private logLevel:     LogLevel
  private prefixFilter?: RegExp

  public textPrinter: (levelTitle: LogLevelTitle, text: string) => void

  constructor () {
    this.level(Brolog.globalLogLevelName)
    this.logLevel = LogLevel[this.level()]

    this.prefix(Brolog.globalPrefix)
    this.prefixFilter = this.prefix()

    this.textPrinter = this.defaultTextPrinter
  }

  /**
   * Create a global Brolog Instance for sharing between modules
   */
  public static instance (
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

  public static version (): string {
    return VERSION
  }

  public version (): string {
    return Brolog.version()
  }

  public static enableLogging (printerFunc: boolean | TextPrinterFunction): Brolog {
    return Brolog.instance().enableLogging(printerFunc)
  }

  public enableLogging (printerFunc: boolean | TextPrinterFunction): Brolog {
    this.verbose('Brolog', 'enableLogging(%s)', printerFunc)

    if (printerFunc === false) {
      this.silly('Brolog', 'enableLogging() disabled')
      this.textPrinter = function () { /* null logger */ }
    } else if (printerFunc === true) {
      this.silly('Brolog', 'enableLogging() enabled: restore Brolog instance')
      this.textPrinter = this.defaultTextPrinter
    } else if (typeof printerFunc === 'function') {
      this.silly('Brolog', 'enableLogging() enabled: using provided log function')
      this.textPrinter = function (levelTitle: LogLevelTitle, text: string): void {
        printerFunc(levelTitle, text)
      }
    } else {
      throw new Error('got invalid logger')
    }

    return this
  }

  public static prefix (): RegExp
  public static prefix (filter: string | RegExp): void
  public static prefix (filter?: string | RegExp): void | RegExp {
    if (filter) {
      this.globalPrefix = filter
      this.globalInstance?.prefix(filter)
    } else {
      return this.instance().prefix()
    }
  }

  public prefix (): RegExp
  public prefix (filter: string | RegExp): void
  public prefix (filter?: string | RegExp): void | RegExp {
    if (filter) {
      if (typeof filter === 'string') {
        this.prefixFilter = new RegExp('^' + filter + '$')
      } else if (filter instanceof RegExp) {
        this.prefixFilter = filter
      } else {
        throw new Error('unsupported prefix filter')
      }
    } else {
      return this.prefixFilter
    }
  }

  public static level (levelName?: LogLevelName): LogLevelName {
    if (levelName) {
      this.globalLogLevelName = levelName
    }
    return this.instance().level(levelName)
  }

  public level (levelName?: LogLevelName): LogLevelName {
    if (levelName) {
      const key = levelName.toLowerCase() as LogLevelName
      let logLevel: LogLevel | undefined = LogLevel[key]
      if (logLevel === undefined) {
        log.error('Brolog', 'level(%s) not exist, set to silly.', levelName)
        logLevel = LogLevel.silly
      }
      this.logLevel = logLevel
    }
    return (LogLevelNames[this.logLevel] ?? 'info') as LogLevelName
  }

  private log (levelTitle: LogLevelTitle, prefix: string, message?: unknown, ...rest: unknown[]) {
    if (this.prefixFilter && !this.prefixFilter.test(prefix)) {
      return
    }

    // sprintf() calls .replace on the format string. Callers pass Error, number,
    // and object messages (log.error('X', err)); coerce them the way the previous
    // concatenation did, and keep 0 instead of dropping it with `message || ''`.
    const formattedMessage = sprintf(formatMessage(message), ...rest)
    const text = this.timestamp() + levelTitle + ' ' + prefix + (formattedMessage ? ' ' + formattedMessage : '')
    this.textPrinter(levelTitle, text)
  }

  public defaultTextPrinter (levelTitle: LogLevelTitle, text: string): void {
    switch (levelTitle) {
      case 'ERR':
        console.error(text)
        break
      case 'WARN':
        console.warn(text)
        break
      case 'INFO':
        console.info(text)
        break
      default:
      case 'VERB':
      case 'SILL':
        console.log(text)
    }
  }

  public static error (prefix: string, ...args: any[]): void {
    const instance = Brolog.instance()
    instance.error(prefix, ...args)
  }

  public error (prefix: string, ...args: any[]): void {
    if (this.logLevel < LogLevel.error) {
      return
    }
    this.log('ERR', prefix, args[0], ...args.slice(1))
  }

  public static warn (prefix: string, ...args: any[]): void {
    const instance = Brolog.instance()
    instance.warn(prefix, ...args)
  }

  public warn (prefix: string, ...args: any[]): void {
    if (this.logLevel < LogLevel.warn) {
      return
    }
    this.log('WARN', prefix, args[0], ...args.slice(1))
  }

  public static info (prefix: string, ...args: any[]): void {
    const instance = Brolog.instance()
    instance.info(prefix, ...args)
  }

  public info (prefix: string, ...args: any[]): void {
    if (this.logLevel < LogLevel.info) {
      return
    }
    this.log('INFO', prefix, args[0], ...args.slice(1))
  }

  public static verbose (prefix: string, ...args: any[]): void {
    const instance = Brolog.instance()
    instance.verbose(prefix, ...args)
  }

  public verbose (prefix: string, ...args: any[]): void {
    if (this.logLevel < LogLevel.verbose) {
      return
    }
    this.log('VERB', prefix, args[0], ...args.slice(1))
  }

  public static silly (prefix: string, ...args: any[]): void {
    const instance = Brolog.instance()
    instance.silly(prefix, ...args)
  }

  public silly (prefix: string, ...args: any[]): void {
    if (this.logLevel < LogLevel.silly) {
      return
    }
    this.log('SILL', prefix, args[0], ...args.slice(1))
  }

  public timestamp (enable: boolean): void
  public timestamp (): string
  public timestamp (enable?: boolean): string | void {
    if (typeof enable === 'boolean') {
      this.enableTimestamp = enable
      return
    }

    if (!this.enableTimestamp) {
      return ''
    }

    const date  = new Date()
    const hour  = date.getHours()
    const min   = date.getMinutes()
    const sec   = date.getSeconds()

    let stampStr = ''
    stampStr += (hour < 10) ? ('0' + hour)  : hour
    stampStr += ':'
    stampStr += (min < 10)  ? ('0' + min)   : min
    stampStr += ':'
    stampStr += (sec < 10)  ? ('0' + sec)   : sec

    return stampStr + ' '
  }

}

function formatMessage (message: unknown): string {
  if (typeof message === 'string') {
    return message
  }
  // No message argument: log.error('prefix') passes undefined. Do not print "undefined".
  if (message == null) {
    return ''
  }
  return String(message)
}

function sprintf (format: string, ...formatArgs: unknown[]): string {
  let i = 0
  return format.replace(/%((%)|s|d)/g, (match, _p1, p2) => {
    if (p2) {
      return p2
    }
    let val = formatArgs[i]
    if (match === '%d') {
      val = Number(val)
    }
    i++
    return String(val)
  })
}

export {
  VERSION,
}

const log = Brolog.instance()

if (BROLOG_LEVEL) {
  if (BROLOG_LEVEL === '*') {
    log.level('silly')
  } else {
    log.level(BROLOG_LEVEL as any)
  }
}

if (BROLOG_PREFIX && BROLOG_PREFIX !== '*') {
  log.prefix(BROLOG_PREFIX)
}

export type {
  LogLevelTitle,
  LogLevelName,
}
export {
  LogLevel,
  Brolog,
  log,
}
