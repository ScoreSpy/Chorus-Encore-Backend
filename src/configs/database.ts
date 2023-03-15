import { DataSource } from 'typeorm'
import config from './json/database.json'

/*
 * import env from './../../env.json'
 * process.env = Object.assign(process.env, env)
 */

const output = {
  get TYPEORM_CONNECTION (): string {
    if ('TYPEORM_CONNECTION' in process.env) { return process.env.TYPEORM_CONNECTION }
    return config.type
  },
  get TYPEORM_DATABASE (): string {
    if ('TYPEORM_DATABASE' in process.env) { return process.env.TYPEORM_DATABASE }
    return config.database
  },
  get TYPEORM_HOST (): string {
    if ('TYPEORM_HOST' in process.env) { return process.env.TYPEORM_HOST }
    return config.host
  },
  get TYPEORM_LOGGING (): boolean {
    if ('TYPEORM_LOGGING' in process.env) { return process.env.TYPEORM_LOGGING.toLowerCase() === 'true' }
    return config.logging
  },
  get TYPEORM_PASSWORD (): string {
    if ('TYPEORM_PASSWORD' in process.env) { return process.env.TYPEORM_PASSWORD }
    return config.password
  },
  get TYPEORM_PORT (): number {
    if ('TYPEORM_PORT' in process.env) { return parseInt(process.env.TYPEORM_PORT, 10) }
    return config.port
  },
  get TYPEORM_SYNCHRONIZE (): boolean {
    return false
  },
  get TYPEORM_USERNAME (): string {
    if ('TYPEORM_USERNAME' in process.env) { return process.env.TYPEORM_USERNAME }
    return config.username
  }
}

export default {
  type: output.TYPEORM_CONNECTION || config.type,
  host: output.TYPEORM_HOST || config.host,
  port: output.TYPEORM_PORT || config.port,
  username: output.TYPEORM_USERNAME || config.username,
  password: output.TYPEORM_PASSWORD || config.password,
  database: output.TYPEORM_DATABASE || config.database,
  synchronize: false,
  logging: output.TYPEORM_LOGGING || output.TYPEORM_LOGGING,
  entities: ['src/orm/entity/*.ts'],
  subscribers: ['src/orm/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber'
  }
}

export const connectionSource = new DataSource({
  type: (output.TYPEORM_CONNECTION || config.type) as any,
  host: output.TYPEORM_HOST || config.host,
  port: output.TYPEORM_PORT || config.port,
  username: output.TYPEORM_USERNAME || config.username,
  password: output.TYPEORM_PASSWORD || config.password,
  database: output.TYPEORM_DATABASE || config.database,
  synchronize: false,
  logging: output.TYPEORM_LOGGING || output.TYPEORM_LOGGING,
  entities: ['src/orm/entity/*.ts'],
  migrations: ['src/orm/migration/**/*.ts'],
  subscribers: ['src/orm/subscriber/**/*.ts']
})
