import { variables } from '../orm/entity/variables'
import database from './../modules/database'

class Cache {
  data: {
    maintenanceEnabled: variables
  }

  constructor () {
    this.data = {
      maintenanceEnabled: this.createInstance('maintenanceEnabled', false)
    }
  }

  private createInstance (key: string, value: boolean): variables {
    const data = new variables()
    data.key = key
    data.value = value

    return data
  }

  async init () {
    const data = await database.variables.find()
    data.forEach((metric) => {
      if (this.data[metric.key]) {
        this.data[metric.key].value = metric.value
      }
    })
  }

  get maintenanceEnabled () {
    return this.data.maintenanceEnabled.value
  }
  set maintenanceEnabled (value: boolean) {
    this.data.maintenanceEnabled.value = value
    database.variables.save(this.data.maintenanceEnabled).catch()
  }
}

export default new Cache()
