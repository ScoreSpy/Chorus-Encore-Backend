import { FastifyInstance, FastifyServerOptions } from 'fastify'

import GET_ping from './GET_ping'
import POST_ingestSongs from './POST_ingestSongs'

export default function RouteIndex (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  server.register(GET_ping)
  server.register(POST_ingestSongs)

  next()
}
