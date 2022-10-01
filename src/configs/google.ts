import config from './json/google.json'

export default {
  get apiKey (): string {
    if ('SS_google_apiKey' in process.env) { return process.env.SS_google_apiKey }
    return config.apiKey
  },
  get id (): string {
    if ('SS_google_id' in process.env) { return process.env.SS_google_id }
    return config.id
  },
  get secret (): string {
    if ('SS_google_secret' in process.env) { return process.env.SS_google_secret }
    return config.secret
  }
}
