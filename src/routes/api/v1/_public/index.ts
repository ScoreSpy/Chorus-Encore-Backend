import { FastifyInstance, FastifyServerOptions } from 'fastify'

import GET_count from './GET_count'
import GET_latest from './GET_latest'
import GET_random from './GET_random'
import GET_search from './GET_search'

export default function RouteIndex (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  server.register(GET_count)
  server.register(GET_latest)
  server.register(GET_random)
  server.register(GET_search)

  next()
}
