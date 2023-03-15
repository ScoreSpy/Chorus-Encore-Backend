import config from './json/connections.json'

export default {
  discord: {
    get id (): string {
      if ('CE_connections_discord_id' in process.env) { return process.env.CE_connections_discord_id as string }
      return config.discord.id
    },
    get secret (): string {
      if ('CE_connections_discord_secret' in process.env) { return process.env.CE_connections_discord_secret as string }
      return config.discord.secret
    }
  }
}
