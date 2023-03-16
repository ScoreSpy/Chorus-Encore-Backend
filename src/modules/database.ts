import 'reflect-metadata'
import { DataSource, Repository } from 'typeorm'
import { DatabaseMonitor } from './databaseMonitor'
import config from './../configs/database'

import { archives } from '../orm/entity/archives'
import { charts } from './../orm/entity/charts'
import { system_logs } from './../orm/entity/system_logs'

class Database {
  ready: boolean

  archives!: Repository<archives>
  charts!: Repository<charts>
  system_logs!: Repository<system_logs>

  manager!: DataSource

  constructor () {
    this.ready = false
  }

  async init () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const connectionOptions: any = config

    Object.assign(config, {
      options: { encrypt: true },
      entities: [
        archives,
        charts,
        system_logs
      ],
      bigNumberStrings: false,
      logger: new DatabaseMonitor(),
      logging: true,
      maxQueryExecutionTime: -1
    })

    connectionOptions.charset = 'utf8mb4'

    const AppDataSource = new DataSource(connectionOptions)
    this.manager = await AppDataSource.initialize()

    this.archives = this.manager.getRepository(archives)
    this.charts = this.manager.getRepository(charts)
    this.system_logs = this.manager.getRepository(system_logs)

    await this.system_logs.insert({ log: 'Database Connected', type: 0, module: 'Database' })
    this.ready = true
  }
}

export default new Database()
