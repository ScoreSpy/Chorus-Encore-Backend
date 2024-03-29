import config from './json/elastic.json'

export default {
  get username (): string {
    if ('CE_elastic_username' in process.env) { return process.env.CE_elastic_username as string }
    return config.username
  },

  get password (): string {
    if ('CE_elastic_password' in process.env) { return process.env.CE_elastic_password as string }
    return config.password
  }
}
