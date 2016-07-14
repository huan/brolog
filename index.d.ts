export namespace brolog {
  function level(...args: any[]): any

  function error(name: string, ...args: any[]): any
  function warn(name: string, ...args: any[]): any
  function info(name: string, ...args: any[]): any
  function verbose(name: string, ...args: any[]): any
  function silly(name: string, ...args: any[]): any
}