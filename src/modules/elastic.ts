import { Client } from '@elastic/elasticsearch'
import { createContext } from './log'
import config from './../configs/elastic'

const logger = createContext('elastic')
class Database {
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
    await this.wipeIndex('CE_songs')
  }

  async wipeIndex (index: string) {
    try {
      await this.client.indices.delete({ index })
    } catch (error) {
      if (error.message !== 'index_not_found_exception') { logger.error(error) }
    }
  }

  handeErrors (bulkResponse: any, body: any) {
    if (bulkResponse.errors) {
      const erroredDocuments: any = []
      bulkResponse.items.forEach((action: any, i: number) => {
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

export default new Database()
