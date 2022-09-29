import { FastifyReply, FastifyRequest } from 'fastify'

// eslint-disable-next-line require-await
export default async function isLocalhost (req: FastifyRequest, res: FastifyReply) {
  if (req.ip !== '127.0.0.1') { return res.code(401).send('401 Unauthorized') }
}
