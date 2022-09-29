import { FastifyInstance, FastifyServerOptions } from 'fastify'

const route = '/search'
const schema: unknown = {
  summary: 'Searches according to a query string, yields 20 results',
  description: '',
  tags: ['Public'],
  params: {
    type: 'object',
    required: [],
    properties: {
      name: { type: 'string' },
      artist: { type: 'string' },
      album: { type: 'string' },
      genre: { type: 'string' },
      charter: { type: 'string' },
      tier_band: { type: 'string' },
      tier_guitar: { type: 'string' },
      tier_bass: { type: 'string' },
      tier_rhythm: { type: 'string' },
      tier_drums: { type: 'string' },
      tier_vocals: { type: 'string' },
      tier_keys: { type: 'string' },
      tier_guitarghl: { type: 'string' },
      tier_bassghl: { type: 'string' },
      diff_guitar: { type: 'string' },
      diff_bass: { type: 'string' },
      diff_rhythm: { type: 'string' },
      diff_drums: { type: 'string' },
      diff_keys: { type: 'string' },
      diff_guitarghl: { type: 'string' },
      diff_bassghl: { type: 'string' },
      hasForced: { type: 'boolean' },
      hasOpen: { type: 'boolean' },
      hasTap: { type: 'boolean' },
      hasSections: { type: 'boolean' },
      hasStarPower: { type: 'boolean' },
      hasSoloSections: { type: 'boolean' },
      hasStems: { type: 'boolean' },
      hasVideo: { type: 'boolean' },
      hasLyrics: { type: 'boolean' },
      is120: { type: 'boolean' },
      md5: { type: 'string' },
      from: { type: 'number' }
    }
  }
}

export default function GET_search (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  // eslint-disable-next-line require-await
  server.get(route, { preHandler: [], schema }, async (req, res) => {
    res.send({})
  })

  next()
}
