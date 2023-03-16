import { createClient } from 'redis'
import database from './modules/database'
import elastic from './modules/elastic'
import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import fileUpload from 'fastify-file-upload'
import logger from './modules/log'
import overides from './configs/json/overides.json'
import redisModule from './modules/redis'
import RedisStore from 'connect-redis'
import scheduler from './modules/scheduler'
import sessionConfig from './configs/session'
import v1Handler from './routes/api/v1/'
import webhooks from './modules/webhooks'
import webserverConfig from './configs/webserver'
import ScanCE from './modules/googleDrive'

declare module 'fastify' {
  interface Session {
    isAuthenticated: boolean
  }
}

const log = logger.createContext('server')

const SESSION_TTL = (24 * 60 * 60 * 1000) * 15

const redisClient = createClient({ url: 'redis://127.0.0.1:6379', database: 9 })
// const RedisStore = connectRedis(fastifySession as any)

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'CE_'
})

async function Server () {
  const server = fastify({ trustProxy: true, bodyLimit: 1048576 * 50, maxParamLength: Number.MAX_SAFE_INTEGER })

  server.addHook('onRequest', (request, reply, done) => done())

  server.addHook('onResponse', (request, reply, done) => done())

  server.addHook('onError', (request, reply, error, done) => {
    log.error(error)
    done()
  })

  server.register(fastifyCookie)

  server.register(fastifySession, {
    secret: sessionConfig.secret,
    store: redisStore,
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

  console.log('init redisModule')
  redisModule.init()

  console.log('init database')
  await database.init()

  console.log('init elastic')
  elastic.init()

  console.log('init scheduler')
  await scheduler.init()

  server.register(v1Handler, { prefix: '/api/v1' })

  server.listen({ host: webserverConfig.host, port: webserverConfig.port })
  console.log(`server listening on http://${webserverConfig.host}:${webserverConfig.port}`)

  await ScanCE()

  return server
}

export default Server

Server()
