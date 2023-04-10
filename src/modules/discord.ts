import axios from 'axios'

export type Discord_me = {
  id: string,
  username: string,
  discriminator: string,
  avatar?: string,
  verified?: boolean,
  email?: string,
  flags?: number,
  banner?: string,
  accent_color?: number,
  premium_type?: number,
  public_flags?: number
}

export async function me (accessToken: string): Promise<Discord_me> {
  const data = await axios.get('https://discord.com/api/users/@me', { headers: { Authorization: `Bearer ${accessToken}` } })
  return data.data
}
