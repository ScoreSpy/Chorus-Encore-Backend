import config from './json/session.json'

export default {
  get secret (): string {
    if ('CE_session_secret' in process.env) { return process.env.CE_session_secret as string }
    return config.secret
  },

  get resave (): boolean {
    if ('CE_session_resave' in process.env) { return (process.env.CE_session_resave as string).toLocaleLowerCase() === 'true' }
    return config.resave
  },

  get secure (): boolean {
    if ('CE_session_secure' in process.env) { return (process.env.CE_session_secure as string).toLocaleLowerCase() === 'true' }
    return config.secure
  },

  get cookieName (): string {
    if ('CE_session_cookieName' in process.env) { return process.env.CE_session_cookieName as string }
    return config.cookieName
  }
}
