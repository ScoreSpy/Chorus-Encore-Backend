import { createClient } from 'redis'

class Redis {
  client: ReturnType<typeof createClient>
  ready: boolean

  constructor () {
    this.ready = false
  }

  init (): void {
    if (this.ready) { throw new Error('Redis re-init') }

    this.client = createClient(6379, '127.0.0.1', { db: 9 })
  }
}

export default new Redis()
