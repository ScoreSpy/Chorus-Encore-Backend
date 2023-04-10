import { FastifyInstance, FastifyServerOptions } from 'fastify'

const route = '/ping'
const schema = {
  summary: '',
  description: '',
  tags: ['Public'],
  response: {
    200: {
      type: 'object',
      properties: {
        isAuthenticated: { type: 'boolean' },
        user: {
          type: 'object',
          properties: {
            snowflake: { type: 'string' },
            displayName: { type: 'string' },
            userLevel: { type: 'number' }
          }
        }
      }
    }
  }
}

export default function GET_ping (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  // eslint-disable-next-line require-await
  server.get(route, { preHandler: [], schema }, async (req, res) => {
    if (!req.session.isAuthenticated) { return res.send({ isAuthenticated: false }) }

    return res.send({ isAuthenticated: true, user: req.session.user })
  })

  next()
}
