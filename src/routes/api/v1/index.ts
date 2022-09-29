import { FastifyInstance, FastifyServerOptions } from 'fastify'
import RouteInternal from './_internal'
import RoutePublic from './_public'

export default function RouteIndex (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  server.register(RouteInternal, { prefix: '/internal' })
  server.register(RoutePublic, { prefix: '/public' })

  next()
}
