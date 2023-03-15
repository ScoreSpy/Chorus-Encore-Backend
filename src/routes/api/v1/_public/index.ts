import { FastifyInstance, FastifyServerOptions } from 'fastify'

import GET_ping from './GET_ping'

export default function RouteIndex (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  server.register(GET_ping)

  next()
}
