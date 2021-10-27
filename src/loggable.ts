import NOP from 'nop'

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
    error   : NOP,
    info    : NOP,
    silly   : NOP,
    verbose : NOP,
    warn    : NOP,
  }
}

export type {
  Loggable,
}
export {
  getLoggable,
}
