import { FastifyInstance, FastifyServerOptions } from 'fastify'
import isLocalhost from './../../../../middleware/isLocalhost'
import promClient from 'prom-client'

const route = '/metrics'
const schema: unknown = {
  summary: '',
  description: '',
  tags: ['Internal']
}

export default function POST_twitch_updateRequest (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  server.get(route, { preHandler: [isLocalhost], schema }, async (req, res) => {
    res.send(await promClient.register.metrics())
  })

  next()
}
