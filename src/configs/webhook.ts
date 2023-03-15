import config from './json/webhook.json'

export default {
  // Error hooks
  get error_id (): string {
    if ('CE_webhook_error_id' in process.env) { return process.env.CE_webhook_error_id }
    return config.error.id
  },
  get error_token (): string {
    if ('CE_webhook_error_token' in process.env) { return process.env.CE_webhook_error_token }
    return config.error.token
  },
}

