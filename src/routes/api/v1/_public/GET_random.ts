import { FastifyInstance, FastifyServerOptions } from 'fastify'

const route = '/random'
const schema: unknown = {
  summary: 'Yields 20 charts picked at random',
  description: '',
  tags: ['Public']
}

export default function GET_random (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  // eslint-disable-next-line require-await
  server.get(route, { preHandler: [], schema }, async (req, res) => {
    res.send({})
  })

  next()
}
