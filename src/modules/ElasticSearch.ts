import { Client } from '@elastic/elasticsearch'
import { createContext } from './log'
import config from './../configs/elastic'
import database from './database'

const logger = createContext('elastic')
const indexName = 'CE_songbook'

export type ElasticSongs = {
  snowflake: bigint,
  checksum: string,

  has_video: boolean,
  has_future_bundle: boolean,

  ini_name: string,
  ini_album: string,
  ini_artist: string,
  ini_charter: string,
  ini_year: number,
  ini_genre: string,

  ini_five_lane_drums: boolean,
  ini_pro_drums: boolean,

  chart_hasSections: boolean,
  chart_hasStarPower: boolean,
  chart_hasSoloSections: boolean,
  chart_hasTap: boolean,
  chart_is120: boolean,
  chart_hasLyrics: boolean,

  chart_hasOpen: boolean,

  chart_hasOpen_guitar: boolean,
  chart_hasOpen_bass: boolean,
  chart_hasOpen_rhythm: boolean,
  chart_hasOpen_keys: boolean,
  chart_hasOpen_drums: boolean,
  chart_hasOpen_guitarghl: boolean,
  chart_hasOpen_bassghl: boolean,

  chart_difficultys_guitar: number,
  chart_difficultys_bass: number,
  chart_difficultys_rhythm: number,
  chart_difficultys_keys: number,
  chart_difficultys_drums: number,
  chart_difficultys_guitarghl: number,
  chart_difficultys_bassghl: number,

  chart_instruments: number
}

class ElasticSearch {
  ready: boolean
  client!: Client
  constructor () {
    this.ready = false
  }

  public init () {
    if (this.ready) { throw new Error('Elastic re-init') }
    const hostname = 'http://localhost:9200'
    this.client = new Client({ node: hostname, auth: { username: config.username, password: config.password } })
  }

  async createIndexes () {
    await this.wipeIndex(indexName)
    await this.createSongsIndex()
  }

  async createSongsIndex () {
    await this.client.indices.create({
      index: indexName,
      body: {
        mappings: {
          properties: {
            snowflake: { type: 'long' },
            checksum: { type: 'keyword' },

            has_video: { type: 'boolean' },
            has_future_bundle: { type: 'boolean' },

            ini_name: { type: 'keyword' },
            ini_album: { type: 'keyword' },
            ini_artist: { type: 'keyword' },
            ini_charter: { type: 'keyword' },
            ini_year: { type: 'integer' },
            ini_genre: { type: 'keyword' },

            ini_five_lane_drums: { type: 'boolean' },
            ini_pro_drums: { type: 'boolean' },

            chart_hasSections: { type: 'boolean' },
            chart_hasStarPower: { type: 'boolean' },
            chart_hasSoloSections: { type: 'boolean' },
            chart_hasTap: { type: 'boolean' },
            chart_is120: { type: 'boolean' },
            chart_hasLyrics: { type: 'boolean' },

            chart_hasOpen: { type: 'boolean' },

            chart_hasOpen_guitar: { type: 'boolean' },
            chart_hasOpen_bass: { type: 'boolean' },
            chart_hasOpen_rhythm: { type: 'boolean' },
            chart_hasOpen_keys: { type: 'boolean' },
            chart_hasOpen_drums: { type: 'boolean' },
            chart_hasOpen_guitarghl: { type: 'boolean' },
            chart_hasOpen_bassghl: { type: 'boolean' },

            chart_difficultys_guitar: { type: 'integer' },
            chart_difficultys_bass: { type: 'integer' },
            chart_difficultys_rhythm: { type: 'integer' },
            chart_difficultys_keys: { type: 'integer' },
            chart_difficultys_drums: { type: 'integer' },
            chart_difficultys_guitarghl: { type: 'integer' },
            chart_difficultys_bassghl: { type: 'integer' },

            chart_instruments: { type: 'integer' }
          }
        }
      }
    })

    const songs = await database.charts.find()
    if (!songs || !songs[0]) { return }

    return this.addSongs(songs.map((s) => ({
      snowflake: BigInt(s.snowflake),
      checksum: s.checksum,

      has_video: s.has_video,
      has_future_bundle: s.has_future_bundle,

      ini_name: s.ini_name,
      ini_album: s.ini_album,
      ini_artist: s.ini_artist,
      ini_charter: s.ini_charter,
      ini_year: s.ini_year,
      ini_genre: s.ini_genre,

      ini_five_lane_drums: s.ini_five_lane_drums,
      ini_pro_drums: s.ini_pro_drums,

      chart_hasSections: s.chart_hasSections,
      chart_hasStarPower: s.chart_hasStarPower,
      chart_hasSoloSections: s.chart_hasSoloSections,
      chart_hasTap: s.chart_hasTap,
      chart_is120: s.chart_is120,
      chart_hasLyrics: s.chart_hasLyrics,

      chart_hasOpen: Boolean(s.chart_hasOpen_bass || s.chart_hasOpen_bassghl || s.chart_hasOpen_drums || s.chart_hasOpen_guitar || s.chart_hasOpen_guitarghl || s.chart_hasOpen_keys || s.chart_hasOpen_rhythm),

      chart_hasOpen_guitar: s.chart_hasOpen_guitar,
      chart_hasOpen_bass: s.chart_hasOpen_bass,
      chart_hasOpen_rhythm: s.chart_hasOpen_rhythm,
      chart_hasOpen_keys: s.chart_hasOpen_keys,
      chart_hasOpen_drums: s.chart_hasOpen_drums,
      chart_hasOpen_guitarghl: s.chart_hasOpen_guitarghl,
      chart_hasOpen_bassghl: s.chart_hasOpen_bassghl,

      chart_difficultys_guitar: s.chart_difficultys_guitar,
      chart_difficultys_bass: s.chart_difficultys_bass,
      chart_difficultys_rhythm: s.chart_difficultys_rhythm,
      chart_difficultys_keys: s.chart_difficultys_keys,
      chart_difficultys_drums: s.chart_difficultys_drums,
      chart_difficultys_guitarghl: s.chart_difficultys_guitarghl,
      chart_difficultys_bassghl: s.chart_difficultys_bassghl,

      chart_instruments: s.chart_instruments
    })))
  }

  async wipeIndex (index: string) {
    try {
      await this.client.indices.delete({ index })
    } catch (error) {
      if (error.message !== 'index_not_found_exception') { logger.error(error) }
    }
  }

  async addSongs (songArray: ElasticSongs[]): Promise<void> {
    logger.log(`adding ${songArray.length} songs to datastore!`)
    const body = songArray.flatMap((doc) => [{ index: { _index: indexName } }, doc])
    const { body: bulkResponse } = await this.client.bulk({ refresh: true, body })
    this.handeErrors(bulkResponse, body)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handeErrors (bulkResponse: any, body: unknown) {
    if (bulkResponse.errors) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const erroredDocuments: any = []
      bulkResponse.items.forEach((action: unknown, i: number) => {
        const operation = Object.keys(action)[0]
        if (action[operation].error) {
          erroredDocuments.push({
            status: action[operation].status,
            error: action[operation].error,
            operation: body[i * 2],
            document: body[(i * 2) + 1]
          })
        }
      })
      if (erroredDocuments[0]) {
        logger.error(erroredDocuments)
      }
    }
  }
}

export default new ElasticSearch()
