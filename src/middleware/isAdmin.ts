import { FastifyReply, FastifyRequest } from 'fastify'

// eslint-disable-next-line require-await
export default async function isAdmin (req: FastifyRequest, res: FastifyReply) {
  if (!req.session || !req.session.user || !req.session.user.admin) { return res.code(401).send('Unauthorized') }
}
