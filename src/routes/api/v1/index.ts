import { FastifyInstance, FastifyServerOptions } from 'fastify'

import RouteLogin from './_login'
import RoutePublic from './_public'
import RouteUser from './_user'

export default function RouteIndex (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  server.register(RouteLogin, { prefix: '/login' })
  server.register(RoutePublic, { prefix: '/public' })
  server.register(RouteUser, { prefix: '/user' })

  next()
}
