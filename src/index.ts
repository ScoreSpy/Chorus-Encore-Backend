import database from './modules/database'
import discordConfig from './configs/discord'
import elastic from './modules/elastic'
import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifySession from '@fastify/session'
import fileUpload from 'fastify-file-upload'
import logger from './modules/log'
import oauthPlugin, { OAuth2Namespace } from '@fastify/oauth2'
import overides from './configs/json/overides.json'
import scheduler from './modules/scheduler'
import sessionConfig from './configs/session'
import v1Handler from './routes/api/v1/'
import webhooks from './modules/webhooks'
import webserverConfig from './configs/webserver'
import { UserLevel } from './orm/entity/users'

// this is only temp, please dont judge me q.q
// eslint-disable-next-line no-new-func
const importDynamic = new Function('modulePath', 'return import(modulePath)')

declare module 'fastify' {
  interface FastifyInstance {
    discordOAuth2: OAuth2Namespace
  }
  interface Session {
    isAuthenticated: boolean,
    user: {
      snowflake: string,
      displayName: string,
      userLevel: UserLevel
    }
  }
}

const log = logger.createContext('server')

const SESSION_TTL = (24 * 60 * 60 * 1000) * 15
const BODY_SIZE_LIMIT = 50 * 1024 * 1024

async function Server () {
  const server = fastify({ trustProxy: true, bodyLimit: BODY_SIZE_LIMIT, maxParamLength: Number.MAX_SAFE_INTEGER })

  const owo = await importDynamic('fastify-print-routes')
  await server.register(owo.default)


  server.addHook('onRequest', (request, reply, done) => done())

  server.addHook('onResponse', (request, reply, done) => done())

  server.addHook('onError', (request, reply, error, done) => {
    log.error(error)
    done()
  })

  server.register(fastifyCookie)

  server.register(fastifySession, {
    secret: sessionConfig.secret,
    saveUninitialized: false,
    cookieName: 'ChorusEncore',
    cookie: {
      secure: overides.devMode ? false : sessionConfig.secure,
      maxAge: SESSION_TTL
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)

  server.register(fileUpload, { limits: { fileSize: BODY_SIZE_LIMIT } })

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

  console.log('init database')
  await database.init()

  console.log('init elastic')
  elastic.init()

  console.log('init scheduler')
  await scheduler.init()

  server.register(v1Handler, { prefix: '/api/v1' })

  server.register(oauthPlugin, {
    name: 'discordOAuth2',
    scope: ['identify'],
    credentials: {
      client: { id: discordConfig.id, secret: discordConfig.secret },
      auth: oauthPlugin.DISCORD_CONFIGURATION
    },
    startRedirectPath: '/api/v1/login/discord',
    callbackUri: discordConfig.callback
  })

  server.listen({ host: webserverConfig.host, port: webserverConfig.port })
  console.log(`server listening on http://${webserverConfig.host}:${webserverConfig.port}`)

  return server
}

export default Server

Server()
