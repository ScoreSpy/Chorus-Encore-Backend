import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { me } from './../../../../modules/discord'
import database from './../../../../modules/database'

const route = '/discord/callback'
const schema = {
  summary: '',
  description: '',
  tags: ['Login'],
  response: {
    200: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        username: { type: 'string' },
        discriminator: { type: 'string' }
      }
    }
  }
}

export default function GET_discord_login (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  // eslint-disable-next-line require-await
  server.get(route, { preHandler: [], schema }, async (req, res) => {
    const data = await server.discordOAuth2.getAccessTokenFromAuthorizationCodeFlow(req)
    const user = await me(data.token.access_token)

    const chorusUser = await database.user.findOneBy({ snowflake: user.id })
    if (!chorusUser) { return res.redirect('/') }

    req.session.isAuthenticated = true
    req.session.user = {
      snowflake: chorusUser.snowflake,
      displayName: chorusUser.display_name,
      userLevel: chorusUser.user_level
    }

    return res.redirect('/')
  })

  next()
}
