export declare class Brolog {
  constructor(level?: string)

  level(levelName?: string): number

  error(prefix: string, ...args: any[]): any
  warn(prefix: string, ...args: any[]): any
  info(prefix: string, ...args: any[]): any
  verbose(prefix: string, ...args: any[]): any
  silly(prefix: string, ...args: any[]): any
}