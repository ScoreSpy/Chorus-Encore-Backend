import config from './json/google.json'

export default {
  get apiKey (): string {
    if ('CE_google_apiKey' in process.env) { return process.env.CE_google_apiKey as string }
    return config.apiKey
  },
  get id (): string {
    if ('CE_google_id' in process.env) { return process.env.CE_google_id as string }
    return config.id
  },
  get secret (): string {
    if ('CE_google_secret' in process.env) { return process.env.CE_google_secret as string }
    return config.secret
  }
}
