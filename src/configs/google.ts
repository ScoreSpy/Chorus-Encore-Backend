import config from './json/google.json'

export default {
  get type (): string {
    if ('CE_google_type' in process.env) { return process.env.CE_google_type as string }
    return config.type
  },
  get project_id (): string {
    if ('CE_google_project_id' in process.env) { return process.env.CE_google_project_id as string }
    return config.project_id
  },
  get private_key_id (): string {
    if ('CE_google_private_key_id' in process.env) { return process.env.CE_google_private_key_id as string }
    return config.private_key_id
  },
  get private_key (): string {
    if ('CE_google_private_key' in process.env) { return process.env.CE_google_private_key as string }
    return config.private_key
  },
  get client_email (): string {
    if ('CE_google_client_email' in process.env) { return process.env.CE_google_client_email as string }
    return config.client_email
  },
  get client_id (): string {
    if ('CE_google_client_id' in process.env) { return process.env.CE_google_client_id as string }
    return config.client_id
  },
  get auth_uri (): string {
    if ('CE_google_auth_uri' in process.env) { return process.env.CE_google_auth_uri as string }
    return config.auth_uri
  },
  get token_uri (): string {
    if ('CE_google_token_uri' in process.env) { return process.env.CE_google_token_uri as string }
    return config.token_uri
  },
  get auth_provider_x509_cert_url (): string {
    if ('CE_google_auth_provider_x509_cert_url' in process.env) { return process.env.CE_google_auth_provider_x509_cert_url as string }
    return config.auth_provider_x509_cert_url
  },
  get client_x509_cert_url (): string {
    if ('CE_google_client_x509_cert_url' in process.env) { return process.env.CE_google_client_x509_cert_url as string }
    return config.client_x509_cert_url
  }
}
