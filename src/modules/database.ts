import 'reflect-metadata'
import { DataSource, Repository } from 'typeorm'
import { DatabaseMonitor } from './databaseMonitor'
import config from './../configs/database'

import { archives } from '../orm/entity/archives'
import { system_logs } from './../orm/entity/system_logs'

import { Chart } from './../orm/entity/charts'
import { Chart_NoteCount } from './../orm/entity/chart_notecount'
import { Chart_MaxNps } from './../orm/entity/chart_maxnps'
import { Chart_NoteIssue } from './../orm/entity/chart_noteissue'
import { Chart_TrackIssue } from './../orm/entity/chart_trackissue'
import { Chart_Hash } from './../orm/entity/chart_hash'
import { Chart_Files } from './../orm/entity/chart_files'
import { Chart_Config } from './../orm/entity/chart_config'

class Database {
  ready: boolean

  archives!: Repository<archives>

  chart!: Repository<Chart>
  chart_NoteCount!: Repository<Chart_NoteCount>
  chart_MaxNps!: Repository<Chart_MaxNps>
  chart_NoteIssue!: Repository<Chart_NoteIssue>
  chart_TrackIssue!: Repository<Chart_TrackIssue>
  chart_Hash!: Repository<Chart_Hash>
  chart_Files!: Repository<Chart_Files>
  chart_Config!: Repository<Chart_Config>

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

        Chart,
        Chart_NoteCount,
        Chart_MaxNps,
        Chart_NoteIssue,
        Chart_TrackIssue,
        Chart_Hash,
        Chart_Files,
        Chart_Config,

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

    this.chart = this.manager.getRepository(Chart)
    this.chart_NoteCount = this.manager.getRepository(Chart_NoteCount)
    this.chart_MaxNps = this.manager.getRepository(Chart_MaxNps)
    this.chart_NoteIssue = this.manager.getRepository(Chart_NoteIssue)
    this.chart_TrackIssue = this.manager.getRepository(Chart_TrackIssue)
    this.chart_Hash = this.manager.getRepository(Chart_Hash)
    this.chart_Files = this.manager.getRepository(Chart_Files)
    this.chart_Config = this.manager.getRepository(Chart_Config)

    this.system_logs = this.manager.getRepository(system_logs)

    await this.system_logs.insert({ log: 'Database Connected', type: 0, module: 'Database' })
    this.ready = true
  }
}

export default new Database()
