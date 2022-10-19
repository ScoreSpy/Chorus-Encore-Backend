import config from './json/elastic.json'

export default {
  get username (): string {
    if ('SS_elastic_username' in process.env) { return process.env.SS_elastic_username }
    return config.username
  },

  get password (): string {
    if ('SS_elastic_password' in process.env) { return process.env.SS_elastic_password }
    return config.password
  }
}
