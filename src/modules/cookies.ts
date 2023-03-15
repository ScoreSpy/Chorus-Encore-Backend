import database from './database'
import session from './../configs/session'
import type { FastifyReply, FastifyRequest } from 'fastify'

export function clearCookie (req: FastifyRequest, res: FastifyReply) {
  const sessionID = req.session.sessionId
  const userFlake = req.session.user.snowflake

  return new Promise((resolve) => {
    req.session.isAuthenticated = false
    req.session.user = {} as any

    req.sessionStore.destroy(sessionID, () => {
      database.sessions.delete({ owner: userFlake, session: sessionID })
      req.session = null
      res.clearCookie(session.cookieName)

      // Res.setCookie(session.cookieName, '', { expires: new Date() })
      return resolve(null)
    })
  })
}
