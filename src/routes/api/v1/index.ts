import { FastifyInstance, FastifyServerOptions } from 'fastify'

import RoutePublic from './_public'

export default function RouteIndex (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  server.register(RoutePublic, { prefix: '/public' })

  next()
}
