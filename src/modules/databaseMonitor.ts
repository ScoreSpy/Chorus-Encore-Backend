import { Logger } from 'typeorm'
import { devMode } from './../configs/json/overides.json'

export class DatabaseMonitor implements Logger {
  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor (public enabled = true) {}

  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  logQuery (query: string) {}

  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  logQueryError (error: string, query: string) {}


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logQuerySlow (time: number, query: string, _params: string[]) {
    if (devMode) {
      console.log(`[${time}] ${query}`)
    }
  }

  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  logSchemaBuild (message: string) {}

  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  logMigration (message: string) {}

  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  log (level: 'log' | 'info' | 'warn', message: unknown) {}
}
