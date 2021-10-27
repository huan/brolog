import { nop } from '@pipeletteio/nop'

interface Loggable {
  error   (moduleName: string, message: string, ...args: any[]): void
  warn    (moduleName: string, message: string, ...args: any[]): void
  info    (moduleName: string, message: string, ...args: any[]): void
  verbose (moduleName: string, message: string, ...args: any[]): void
  silly   (moduleName: string, message: string, ...args: any[]): void
}

const getLoggable = (logger?: Loggable): Loggable => {
  if (logger) {
    return logger
  }

  return {
    error   : nop,
    info    : nop,
    silly   : nop,
    verbose : nop,
    warn    : nop,
  }
}

export type {
  Loggable,
}
export {
  getLoggable,
}
