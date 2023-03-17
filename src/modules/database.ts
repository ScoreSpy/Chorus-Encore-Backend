import 'reflect-metadata'
import { DataSource, Repository } from 'typeorm'
import { DatabaseMonitor } from './databaseMonitor'
import config from './../configs/database'

import { archives } from '../orm/entity/archives'
import * as charts from './../orm/entity/charts'
import { system_logs } from './../orm/entity/system_logs'

class Database {
  ready: boolean

  archives!: Repository<archives>

  chart!: Repository<charts.Chart>
  chart_NoteCount!: Repository<charts.Chart_NoteCount>
  chart_MaxNps!: Repository<charts.Chart_MaxNps>
  chart_NoteIssue!: Repository<charts.Chart_NoteIssue>
  chart_TrackIssue!: Repository<charts.Chart_TrackIssue>
  chart_Hash!: Repository<charts.Chart_Hash>

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

        charts.Chart,
        charts.Chart_NoteCount,
        charts.Chart_MaxNps,
        charts.Chart_NoteIssue,
        charts.Chart_TrackIssue,
        charts.Chart_Hash,

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

    this.chart = this.manager.getRepository(charts.Chart)
    this.chart_NoteCount = this.manager.getRepository(charts.Chart_NoteCount)
    this.chart_MaxNps = this.manager.getRepository(charts.Chart_MaxNps)
    this.chart_NoteIssue = this.manager.getRepository(charts.Chart_NoteIssue)
    this.chart_TrackIssue = this.manager.getRepository(charts.Chart_TrackIssue)
    this.chart_Hash = this.manager.getRepository(charts.Chart_Hash)

    this.system_logs = this.manager.getRepository(system_logs)

    await this.system_logs.insert({ log: 'Database Connected', type: 0, module: 'Database' })
    this.ready = true
  }
}

export default new Database()
