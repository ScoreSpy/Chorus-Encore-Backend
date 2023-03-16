import { FastifyInstance, FastifyServerOptions } from 'fastify'

import POST_ingestSongs from './POST_ingestSongs'

export default function RouteIndex (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  server.register(POST_ingestSongs)

  next()
}
