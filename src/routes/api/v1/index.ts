import { FastifyInstance, FastifyServerOptions } from 'fastify'

import RoutePublic from './_public'
import Routeuser from './_user'

export default function RouteIndex (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  server.register(RoutePublic, { prefix: '/public' })
  server.register(Routeuser, { prefix: '/user' })

  next()
}
