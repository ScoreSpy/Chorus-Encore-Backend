import 'reflect-metadata'
import { DataSource, Repository } from 'typeorm'
import { DatabaseMonitor } from './databaseMonitor'
import config from './../configs/database'

import { system_logs } from './../orm/entity/system_logs'

class Database {
  ready: boolean

  system_logs: Repository<system_logs>

  manager: DataSource

  constructor () {
    this.ready = false
  }

  async init () {
    const connectionOptions: any = config

    Object.assign(config, {
      options: { encrypt: true },
      entities: [
        system_logs,
      ],
      bigNumberStrings: false,
      logger: new DatabaseMonitor(),
      logging: true,
      maxQueryExecutionTime: -1
    })

    connectionOptions.charset = 'utf8mb4'

    const AppDataSource = new DataSource(connectionOptions)
    this.manager = await AppDataSource.initialize()

    this.system_logs = this.manager.getRepository(system_logs)

    await this.system_logs.insert({ log: 'Database Connected', type: 0, module: 'Database' })
    this.ready = true
  }
}

export default new Database()
