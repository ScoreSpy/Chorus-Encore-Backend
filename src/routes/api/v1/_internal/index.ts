import { FastifyInstance, FastifyServerOptions } from 'fastify'

import GET_metrics from './GET_metrics'

export default function RouteIndex (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  server.register(GET_metrics)

  next()
}
