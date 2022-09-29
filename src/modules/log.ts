/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-console */
import database from './database'

enum codes { LOG, INFO, WARN, ERROR }

export function log (log: string, module: string): void {
  console.log({ log, module })
  if (!database.ready) { return }

  database.system_logs.insert({ log, stack: null, type: codes.LOG, module }).catch(console.error)
}

export function info (log: string, module: string): void {
  console.info({ log, module })
  if (!database.ready) { return }

  database.system_logs.insert({ log, stack: null, type: codes.INFO, module }).catch(console.error)
}

export function warn (log: string, module: string): void {
  console.warn({ log, module })
  if (!database.ready) { return }

  database.system_logs.insert({ log, stack: null, type: codes.WARN, module }).catch(console.error)
}

export function error (error: Error, module: string): void {
  // eslint-disable-next-line no-param-reassign
  if (!error) { error = new Error('error body missingg?') }

  const errorName = error.message
  const stackTrace = error.stack || null
  console.error({ errorName, module, stackTrace })
  if (!database.ready) { return }

  database.system_logs.insert({ log: errorName, stack: stackTrace, type: codes.ERROR, module }).catch(console.error)
}

export function createContext (modules: string) {
  return {
    log: (logString: string) => log(logString, modules),
    info: (logString: string) => info(logString, modules),
    warn: (logString: string) => warn(logString, modules),
    error: (errors: Error) => error(errors, modules)
  }
}

export default { log, info, warn, error, createContext }
