import { FastifyInstance, FastifyServerOptions } from 'fastify'

const route = '/discord/callback'
const schema = {
  summary: '',
  description: '',
  tags: ['Login'],
  response: {
    200: {
      type: 'object',
      properties: {
        access_token: { type: 'string' }
      }
    }
  }
}

export default function GET_discord_login (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  // eslint-disable-next-line require-await
  server.get(route, { preHandler: [], schema }, async (req, res) => {
    const { token } = await server.facebookOAuth2.getAccessTokenFromAuthorizationCodeFlow(req)

    console.log(token.access_token)

    /*
     * if later you need to refresh the token you can use
     * const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token.refresh_token)
     */

    res.send({ access_token: token.access_token })
  })

  next()
}
