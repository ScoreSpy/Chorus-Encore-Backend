import { FastifyInstance, FastifyServerOptions } from 'fastify'

const route = '/latest'
const schema: unknown = {
  summary: 'Grabs the 20 most recent charts',
  description: '',
  tags: ['Public']
}

export default function GET_latest (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  // eslint-disable-next-line require-await
  server.get(route, { preHandler: [], schema }, async (req, res) => {
    res.send({})
  })

  next()
}
