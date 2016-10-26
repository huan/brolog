// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html
// https://github.com/Microsoft/TypeScript/issues/2076#issuecomment-75052599

export type LogLevel = 'silent'
                      | 'error'
                      | 'warn'
                      | 'info'
                      | 'verbose'
                      | 'silly'

interface Brolog {
  (level?: LogLevel): Brolog
  new (level?: LogLevel): Brolog
  Brolog: Brolog
  // factory(name?: string): Brolog

  level(name?: LogLevel): LogLevel
  defaultLevel(name?: LogLevel): LogLevel

  error(prefix: string, ...args: any[]): void
  warn(prefix: string, ...args: any[]): void
  info(prefix: string, ...args: any[]): void
  verbose(prefix: string, ...args: any[]): void
  silly(prefix: string, ...args: any[]): void
}

declare var Brolog: Brolog
export default Brolog
export { Brolog }
