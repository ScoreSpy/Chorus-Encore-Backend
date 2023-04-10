import { FastifyInstance, FastifyServerOptions } from 'fastify'

export default function RouteIndex (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  next()
}
