import { FastifyInstance, FastifyServerOptions } from 'fastify'
import RouteInternal from './_internal'

export default function RouteIndex (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  server.register(RouteInternal, { prefix: '/internal' })

  next()
}
