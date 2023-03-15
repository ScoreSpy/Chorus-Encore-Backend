import connectRedis from 'connect-redis'
import database from './modules/database'
import elastic from './modules/elastic'
import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import fileUpload from 'fastify-file-upload'
import imageGenerator from './modules/imageGeneration'
import ip from './modules/ip'
import logger from './modules/log'
import overides from './configs/json/overides.json'
import prometheus from './modules/prometheus'
import redis from 'redis'
import redisModule from './modules/redis'
import sessionConfig from './configs/session'
import v1Handler from './routes/api/v1/'
import webhooks from './modules/webhooks'
import scheduler from './modules/scheduler'

declare module 'fastify' {
  interface Session {
    isAuthenticated: boolean
  }
}

const log = logger.createContext('server')

const SESSION_TTL = (24 * 60 * 60 * 1000) * 15
const redisClient = redis.createClient(6379, '127.0.0.1', { db: 5 })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RedisStore = connectRedis(fastifySession as any)

async function Server () {
  const server = fastify({ trustProxy: true, bodyLimit: 1048576 * 50, maxParamLength: Number.MAX_SAFE_INTEGER })

  server.addHook('onRequest', (request, reply, done) => {
    ip(request, null, null).catch(console.error)
    return done()
  })

  server.addHook('onResponse', (request, reply, done) => {
    prometheus.responseCounters(request, reply, reply.getResponseTime())
    return done()
  })

  server.addHook('onError', (request, reply, error, done) => {
    log.error(error)
    done()
  })

  server.register(fastifyCookie)

  server.register(fastifySession, {
    secret: sessionConfig.secret,
    store: new RedisStore({
      client: redisClient,
      disableTouch: false,
      logErrors: true,
      ttl: SESSION_TTL
    }),
    saveUninitialized: false,
    cookieName: 'ChorusEncore',
    cookie: {
      secure: overides.devMode ? false : sessionConfig.secure,
      maxAge: SESSION_TTL
    }
  } as any)

  server.register(fileUpload, { limits: { fileSize: 50 * 1024 * 1024 } })

  server.setErrorHandler((error, req, reply) => {
    log.error(error)

    if (database.system_logs) {
      database.system_logs.insert({ log: error.message, stack: error.stack, type: 1, module: 'Error Handler' })
    }

    webhooks.routeError(req, error)

    if (overides.devMode) {
      reply.code(500).send(`${error.message}\n\n${error.stack}`)
    } else {
      reply.code(500).send('Registered Error')
    }
  })

  server.register(formbody)

  if (overides.devMode) {
    server.register((await import('fastify-oas')).default, {
      routePrefix: '/docs',
      exposeRoute: true,
      swagger: {
        info: { title: 'ScoreSpy', description: 'API Documentation', version: '0.1.0' },
        servers: [
          { url: 'https://scores.xynith.digital', description: 'development' },
          { url: 'https://clonehero.scorespy.online', description: 'production' }
        ],
        schemes: ['https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
          { name: 'Actions', description: '/api/v1/actions' },
          { name: 'Admin', description: '/api/v1/admin' },
          { name: 'Chorus', description: '/api/v1/chorus' },
          { name: 'Connections', description: '/api/v1/connections' },
          { name: 'Hooks', description: '/api/v1/hooks' },
          { name: 'MFA', description: '/api/v1/mfa' },
          { name: 'Mod', description: '/api/v1/mod' },
          { name: 'Public', description: '/api/v1/public' },
          { name: 'Scores', description: '/api/v1/scores' },
          { name: 'User', description: '/api/v1/user' }
        ]
      }
    })
  }

  console.log('init imageGenerator')
  await imageGenerator.init()

  console.log('init prometheus')
  prometheus.init()

  console.log('init redisModule')
  redisModule.init()

  console.log('init database')
  await database.init()

  console.log('init elastic')
  elastic.init()

  console.log('init scheduler')
  await scheduler.init()

  server.register(v1Handler, { prefix: '/api/v1' })

  return Server
}

export default Server
