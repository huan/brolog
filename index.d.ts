export namespace Brolog {
  function level(levelName?: string): number

  function error(prefix: string, ...args: any[]): any
  function warn(prefix: string, ...args: any[]): any
  function info(prefix: string, ...args: any[]): any
  function verbose(prefix: string, ...args: any[]): any
  function silly(prefix: string, ...args: any[]): any
}