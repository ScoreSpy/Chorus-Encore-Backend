import { FastifyInstance, FastifyServerOptions } from 'fastify'

import GET_discord_login_callback from './GET_discord_login_callback'

export default function RouteIndex (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  server.register(GET_discord_login_callback)

  next()
}
