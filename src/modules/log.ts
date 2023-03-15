/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-console */
import database from './database'

enum codes { LOG, INFO, WARN, ERROR }

export function log (log: string, module: string, author?: null | string): void {
  console.log({ log, module, author })
  if (!database.ready) { return }

  database.system_logs.insert({ author, log, stack: null, type: codes.LOG, module }).catch(console.error)
}

export function info (log: string, module: string, author?: null | string): void {
  console.info({ log, module, author })
  if (!database.ready) { return }

  database.system_logs.insert({ author, log, stack: null, type: codes.INFO, module }).catch(console.error)
}

export function warn (log: string, module: string, author?: null | string): void {
  console.warn({ log, module, author })
  if (!database.ready) { return }

  database.system_logs.insert({ author, log, stack: null, type: codes.WARN, module }).catch(console.error)
}

export function error (error: Error, module: string, author?: null | string): void {
  // eslint-disable-next-line no-param-reassign
  if (!error) { error = new Error('error body missingg?') }

  const errorName = error.message
  const stackTrace = error.stack || null
  console.error({ errorName, author, module, stackTrace })
  if (!database.ready) { return }

  database.system_logs.insert({ author, log: errorName, stack: stackTrace, type: codes.ERROR, module }).catch(console.error)
}

export function createContext (modules: string) {
  return {
    log: (logString: string, author?: null | string) => log(logString, modules, author),
    info: (logString: string, author?: null | string) => info(logString, modules, author),
    warn: (logString: string, author?: null | string) => warn(logString, modules, author),
    error: (errors: Error, author?: null | string) => error(errors, modules, author)
  }
}

export default { log, info, warn, error, createContext }
