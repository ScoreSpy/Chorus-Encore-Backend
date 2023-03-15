/* eslint-disable radix */
const EPOCH = 1131408000000
let INCREMENT = 0

class SnowflakeUtil {
  constructor () {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`)
  }

  static generate (wID = 1, pID = 1): string {
    const timestamp = Date.now()
    if (INCREMENT >= 4095) { INCREMENT = 0 }
    const time = (timestamp - EPOCH).toString(2).padStart(42, '0')
    const workerID = (wID).toString(2).padStart(5, '0')
    const processID = (pID).toString(2).padStart(5, '0')
    const increment = (INCREMENT += 1).toString(2).padStart(12, '0')
    const BINARY = `${time}${workerID}${processID}${increment}`
    return this.binaryToID(BINARY)
  }

  static deconstruct (snowflake: string): { timestamp: number, workerID: number, processID: number, increment: number, binary: string, date: Date } {
    const BINARY = this.idToBinary(snowflake).toString().padStart(64, '0')
    const res = {
      timestamp: parseInt(BINARY.substring(0, 42), 2) + EPOCH,
      workerID: parseInt(BINARY.substring(42, 47), 2),
      processID: parseInt(BINARY.substring(47, 52), 2),
      increment: parseInt(BINARY.substring(52, 64), 2),
      binary: BINARY,
      get date () {
        return new Date(this.timestamp)
      }
    }
    return res
  }

  static binaryToID (num: string): string {
    let dec = ''

    while (num.length > 50) {
      const high = parseInt(num.slice(0, -32), 2)
      const low = parseInt((high % 10).toString(2) + num.slice(-32), 2)

      dec = (low % 10).toString() + dec
      // eslint-disable-next-line no-param-reassign
      num = Math.floor(high / 10).toString(2) + Math.floor(low / 10).toString(2).padStart(32, '0')
    }

    let num2 = parseInt(num, 2)
    while (num2 > 0) {
      dec = (num2 % 10).toString() + dec
      num2 = Math.floor(num2 / 10)
    }

    return dec
  }

  static idToBinary (num: string): string {
    let bin = ''
    let high = parseInt(num.slice(0, -10), 0) || 0
    let low = parseInt(num.slice(-10), 0)
    while (low > 0 || high > 0) {
      bin = String(low & 1) + bin
      low = Math.floor(low / 2)
      if (high > 0) {
        low += 5000000000 * (high % 2)
        high = Math.floor(high / 2)
      }
    }
    return bin
  }
}

export default SnowflakeUtil
