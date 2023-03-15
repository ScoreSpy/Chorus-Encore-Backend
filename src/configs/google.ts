import config from './json/google.json'

export default {
  get apiKey (): string {
    if ('CE_google_apiKey' in process.env) { return process.env.CE_google_apiKey }
    return config.apiKey
  },
  get id (): string {
    if ('CE_google_id' in process.env) { return process.env.CE_google_id }
    return config.id
  },
  get secret (): string {
    if ('CE_google_secret' in process.env) { return process.env.CE_google_secret }
    return config.secret
  }
}
