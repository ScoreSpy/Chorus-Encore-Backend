import { createClient } from 'redis'

class Redis {
  client!: ReturnType<typeof createClient>
  ready: boolean

  constructor () {
    this.ready = false
  }

  init (): void {
    if (this.ready) { throw new Error('Redis re-init') }

    this.client = createClient({ url: 'redis://127.0.0.1:6379', database: 10 })
  }
}

export default new Redis()
