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
        response: { type: 'string' }
      }
    }
  }
}

export default function GET_ping (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  // eslint-disable-next-line require-await
  server.get(route, { preHandler: [], schema }, async (req, res) => {
    console.log('owo')
    return res.send({ response: 'pong!' })
  })

  next()
}
