import config from './json/webhook.json'

export default {
  // Error hooks
  get error_id (): string {
    if ('CE_webhook_error_id' in process.env) { return process.env.CE_webhook_error_id as string }
    return config.error.id
  },
  get error_token (): string {
    if ('CE_webhook_error_token' in process.env) { return process.env.CE_webhook_error_token as string }
    return config.error.token
  }
}

