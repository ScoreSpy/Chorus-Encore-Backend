import { BinaryLike, createHash } from 'crypto'
import { charts } from './../orm/entity/charts'
import { ChorusDiffMapBoolean, ChorusDiffMapString, DifficultyFlags, InstrumentFlags } from './../types'

export class Getters {
  static get isProduction (): boolean {
    return process.env.NODE_ENV === 'production'
  }
}

export function createMD5 (data: BinaryLike) {
  return createHash('md5').update(data).digest('hex')
}

export function parseIntOrNull (data?: string): number | null {
  if (!data) { return null }
  const value = parseInt(data, 10)

  if (isNaN(value)) { return null }
  return value
}

export function ChorusMapBooleanToDifficultyFlags (data: ChorusDiffMapBoolean) {
  let flags = DifficultyFlags.None

  if (!data) { return flags }

  if (typeof data.e === 'boolean') { flags += DifficultyFlags.Easy }
  if (typeof data.m === 'boolean') { flags += DifficultyFlags.Medium }
  if (typeof data.h === 'boolean') { flags += DifficultyFlags.Hard }
  if (typeof data.x === 'boolean') { flags += DifficultyFlags.Expert }

  return flags
}

export function ChorusMapStringToDifficultyFlags (data: ChorusDiffMapString) {
  let flags = DifficultyFlags.None

  if (!data) { return flags }

  if (typeof data.e === 'string') { flags += DifficultyFlags.Easy }
  if (typeof data.m === 'string') { flags += DifficultyFlags.Medium }
  if (typeof data.h === 'string') { flags += DifficultyFlags.Hard }
  if (typeof data.x === 'string') { flags += DifficultyFlags.Expert }

  return flags
}

export function GetInstrumentFlagsFromChart (data: charts) {
  let flags = InstrumentFlags.None

  if (!data) { return flags }

  if (data.chart_difficultys_guitar !== DifficultyFlags.None) { flags += InstrumentFlags.Guitar }
  if (data.chart_difficultys_bass !== DifficultyFlags.None) { flags += InstrumentFlags.bass }
  if (data.chart_difficultys_bassghl !== DifficultyFlags.None) { flags += InstrumentFlags.bassghl }
  if (data.chart_difficultys_drums !== DifficultyFlags.None) { flags += InstrumentFlags.drums }
  if (data.chart_difficultys_guitarghl !== DifficultyFlags.None) { flags += InstrumentFlags.guitarghl }
  if (data.chart_difficultys_keys !== DifficultyFlags.None) { flags += InstrumentFlags.keys }
  if (data.chart_difficultys_rhythm !== DifficultyFlags.None) { flags += InstrumentFlags.rhythm }

  return flags
}

export function GetInstrumentFlagsFromChartByDiff (data: charts, target: DifficultyFlags) {
  let flags = InstrumentFlags.None

  if (!data) { return flags }

  if ((data.chart_difficultys_guitar && target) === target) { flags += InstrumentFlags.Guitar }
  if ((data.chart_difficultys_bass && target) === target) { flags += InstrumentFlags.bass }
  if ((data.chart_difficultys_bassghl && target) === target) { flags += InstrumentFlags.bassghl }
  if ((data.chart_difficultys_drums && target) === target) { flags += InstrumentFlags.drums }
  if ((data.chart_difficultys_guitarghl && target) === target) { flags += InstrumentFlags.guitarghl }
  if ((data.chart_difficultys_keys && target) === target) { flags += InstrumentFlags.keys }
  if ((data.chart_difficultys_rhythm && target) === target) { flags += InstrumentFlags.rhythm }

  return flags
}
