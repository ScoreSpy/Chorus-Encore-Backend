import { BinaryLike, createHash } from 'crypto'

export class Getters {
  static get isProduction (): boolean {
    return process.env.NODE_ENV === 'production'
  }
}

export function createMD5 (data: BinaryLike) {
  return createHash('md5').update(data).digest('hex')
}
