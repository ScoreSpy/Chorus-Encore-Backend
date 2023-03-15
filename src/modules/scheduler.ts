import Cron from 'croner'

class scheduler {
  ready: boolean
  TaskDoThing!: Cron

  constructor () {
    this.ready = false
  }

  public async init () {
    if (this.ready) { throw new Error('re-init') }
    this.ready = true

    await this.MethodDoThing()
    this.TaskDoThing = Cron('0 0 * * *', () => { this.MethodDoThing() })
    console.log(`TaskUnban Scheduled: ${this.TaskDoThing.nextRun()}`)
  }

  private MethodDoThing () {
    console.log('Running DoThing')
  }
}

export default new scheduler()
