import 'reflect-metadata'
import { DataSource, Repository } from 'typeorm'
import { DatabaseMonitor } from './databaseMonitor'
import config from './../configs/database'

import { charts } from './../orm/entity/charts'
import { system_logs } from './../orm/entity/system_logs'
import { variables } from './../orm/entity/variables'

class Database {
  ready: boolean

  charts: Repository<charts>
  system_logs: Repository<system_logs>
  variables: Repository<variables>

  manager: DataSource

  constructor () {
    this.ready = false
  }

  async init () {
    const connectionOptions: any = config

    Object.assign(config, {
      options: { encrypt: true },
      entities: [
        charts,
        system_logs,
        variables
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
    this.system_logs = this.manager.getRepository(system_logs)
    this.variables = this.manager.getRepository(variables)

    await this.system_logs.insert({ log: 'Database Connected', type: 0, module: 'Database' })
    this.ready = true
  }
}

export default new Database()
