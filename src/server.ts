import cache from './modules/cache'
import database from './modules/database'
import fastify from 'fastify'
import logger from './modules/log'
import { Getters } from './modules/helpers'
import prometheus from './modules/prometheus'
import v1Handler from './routes/api/v1/'

const log = logger.createContext('server')

async function bottledWasHere() {
  const server = fastify({ trustProxy: true, bodyLimit: 1048576 * 50, maxParamLength: Number.MAX_SAFE_INTEGER })

  server.addHook('onResponse', (request, reply, done) => {
    prometheus.responseCounters(request, reply, reply.getResponseTime())
    return done()
  })

  server.addHook('onError', (request, reply, error, done) => {
    log.error(error)
    done()
  })

  server.setErrorHandler((error, req, reply) => {
    log.error(error)

    if (database.system_logs) {
      database.system_logs.insert({ log: error.message, stack: error.stack, type: 1, module: 'Error Handler' })
    }

    if (Getters.isProduction) {
      reply.code(500).send('Registered Error')
    } else {
      reply.code(500).send(`${error.message}\n\n${error.stack}`)
    }
  })

  if (!Getters.isProduction) {
    server.register((await import('fastify-oas')).default, {
      routePrefix: '/docs',
      exposeRoute: true,
      swagger: {
        info: { title: 'Chorus', description: 'API Documentation', version: '0.1.0' },
        servers: [
          { url: 'https://chorus.xynith.digital/', description: 'development' },
          { url: 'https://chorus.scorespy.online/', description: 'production' }
        ],
        schemes: ['https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
          { name: 'Internal', description: '/api/v1/internal' },
        ]
      }
    })
  }

  prometheus.init()
  await database.init()
  await cache.init()

  server.register(v1Handler, { prefix: '/api/v1' })

  return server
}

export default bottledWasHere
