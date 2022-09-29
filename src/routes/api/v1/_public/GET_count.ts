import { FastifyInstance, FastifyServerOptions } from 'fastify'

const route = '/count'
const schema: unknown = {
  summary: 'Yields the total amount of indexed charts',
  description: '',
  tags: ['Public']
}

export default function GET_count (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  // eslint-disable-next-line require-await
  server.get(route, { preHandler: [], schema }, async (req, res) => {
    res.send({})
  })

  next()
}
