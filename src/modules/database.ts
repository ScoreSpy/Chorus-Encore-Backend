import 'reflect-metadata'
import { DataSource, Repository } from 'typeorm'
import { DatabaseMonitor } from './databaseMonitor'
import config from './../configs/database'

import { charts } from './../orm/entity/charts'
import { remote_charts } from './../orm/entity/remote_charts'
import { system_logs } from './../orm/entity/system_logs'

class Database {
  ready: boolean

  charts!: Repository<charts>
  remote_charts!: Repository<remote_charts>
  system_logs!: Repository<system_logs>

  manager!: DataSource

  constructor () {
    this.ready = false
  }

  async init () {
    const connectionOptions: any = config

    Object.assign(config, {
      options: { encrypt: true },
      entities: [
        charts,
        remote_charts,
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

    this.charts = this.manager.getRepository(charts)
    this.remote_charts = this.manager.getRepository(remote_charts)
    this.system_logs = this.manager.getRepository(system_logs)

    await this.system_logs.insert({ log: 'Database Connected', type: 0, module: 'Database' })
    this.ready = true
  }
}

export default new Database()
