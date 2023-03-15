import config from './json/webserver.json'

export default {
  get host (): string {
    if ('CE_webserver_host' in process.env) { return process.env.CE_webserver_host }
    return config.host
  },

  get port (): number {
    if ('CE_webserver_port' in process.env) { return parseInt(process.env.CE_webserver_port, 10) }
    return config.port
  }
}
