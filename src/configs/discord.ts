import config from './json/discord.json'

export default {
  get id (): string {
    if ('CE_discord_id' in process.env) { return process.env.CE_discord_id as string }
    return config.id
  },

  get secret (): string {
    if ('CE_discord_secret' in process.env) { return process.env.CE_discord_secret as string }
    return config.secret
  },

  get callback (): string {
    if ('CE_discord_callback' in process.env) { return process.env.CE_discord_callback as string }
    return config.callback
  }
}
