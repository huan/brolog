// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html
// https://github.com/Microsoft/TypeScript/issues/2076#issuecomment-75052599

interface Brolog {
  (level?: string): Brolog
  new (level?: string): Brolog
  Brolog: Brolog
  // factory(name?: string): Brolog

  level(name?: string): string
  defaultLevel(name?: string): string

  error(prefix: string, ...args: any[]): void
  warn(prefix: string, ...args: any[]): void
  info(prefix: string, ...args: any[]): void
  verbose(prefix: string, ...args: any[]): void
  silly(prefix: string, ...args: any[]): void
}

export declare var Brolog: Brolog
