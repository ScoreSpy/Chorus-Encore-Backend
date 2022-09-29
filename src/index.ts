import type { FastifyInstance } from 'fastify'

let server: FastifyInstance = null

async function startApplication () {
  const createServer = (await import('./server')).default
  const WebConfig = (await import('./configs/webserver')).default

  const PORT = WebConfig.port
  server = await createServer()

  const address = await server.listen({ port: PORT, host: WebConfig.host })
  console.log(`server listening on ${address}`)
}

startApplication()

module.exports = server
