import { BinaryLike, createHash } from 'crypto'
import { charts } from './../orm/entity/charts'
import { ChorusDiffMapBoolean, ChorusDiffMapString, DifficultyFlags, InstrumentFlags } from './../types'
import { join, parse } from 'path'
import { access, lstat, readdir } from 'fs/promises'
import { drive_v3 } from 'googleapis'

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

export function GetInstrumentFlagsFromChartByDiff (data: charts) {
  const ret = {
    e: InstrumentFlags.None,
    m: InstrumentFlags.None,
    h: InstrumentFlags.None,
    x: InstrumentFlags.None
  }

  if (data.chart_noteCounts_guitar_e > 0) { ret.e += InstrumentFlags.Guitar }
  if (data.chart_noteCounts_bass_e > 0) { ret.e += InstrumentFlags.bass }
  if (data.chart_noteCounts_bassghl_e > 0) { ret.e += InstrumentFlags.bassghl }
  if (data.chart_noteCounts_drums_e > 0) { ret.e += InstrumentFlags.drums }
  if (data.chart_noteCounts_guitarghl_e > 0) { ret.e += InstrumentFlags.guitarghl }
  if (data.chart_noteCounts_keys_e > 0) { ret.e += InstrumentFlags.keys }
  if (data.chart_noteCounts_rhythm_e > 0) { ret.e += InstrumentFlags.rhythm }

  if (data.chart_noteCounts_guitar_m > 0) { ret.m += InstrumentFlags.Guitar }
  if (data.chart_noteCounts_bass_m > 0) { ret.m += InstrumentFlags.bass }
  if (data.chart_noteCounts_bassghl_m > 0) { ret.m += InstrumentFlags.bassghl }
  if (data.chart_noteCounts_drums_m > 0) { ret.m += InstrumentFlags.drums }
  if (data.chart_noteCounts_guitarghl_m > 0) { ret.m += InstrumentFlags.guitarghl }
  if (data.chart_noteCounts_keys_m > 0) { ret.m += InstrumentFlags.keys }
  if (data.chart_noteCounts_rhythm_m > 0) { ret.m += InstrumentFlags.rhythm }

  if (data.chart_noteCounts_guitar_h > 0) { ret.h += InstrumentFlags.Guitar }
  if (data.chart_noteCounts_bass_h > 0) { ret.h += InstrumentFlags.bass }
  if (data.chart_noteCounts_bassghl_h > 0) { ret.h += InstrumentFlags.bassghl }
  if (data.chart_noteCounts_drums_h > 0) { ret.h += InstrumentFlags.drums }
  if (data.chart_noteCounts_guitarghl_h > 0) { ret.h += InstrumentFlags.guitarghl }
  if (data.chart_noteCounts_keys_h > 0) { ret.h += InstrumentFlags.keys }
  if (data.chart_noteCounts_rhythm_h > 0) { ret.h += InstrumentFlags.rhythm }

  if (data.chart_noteCounts_guitar_x > 0) { ret.x += InstrumentFlags.Guitar }
  if (data.chart_noteCounts_bass_x > 0) { ret.x += InstrumentFlags.bass }
  if (data.chart_noteCounts_bassghl_x > 0) { ret.x += InstrumentFlags.bassghl }
  if (data.chart_noteCounts_drums_x > 0) { ret.x += InstrumentFlags.drums }
  if (data.chart_noteCounts_guitarghl_x > 0) { ret.x += InstrumentFlags.guitarghl }
  if (data.chart_noteCounts_keys_x > 0) { ret.x += InstrumentFlags.keys }
  if (data.chart_noteCounts_rhythm_x > 0) { ret.x += InstrumentFlags.rhythm }

  return ret
}

export const SupportedVideoFormats = ['.mp4', '.avi', '.webm', '.vp8', '.ogv', '.mpeg']
export const SupportedImageFormats = ['.png', '.jpg', '.jpeg']
export const SupportedStemNames = ['guitar', 'bass', 'rhythm', 'vocals', 'vocals_1', 'vocals_2', 'drums', 'drums_1', 'drums_2', 'drums_3', 'drums_4', 'keys', 'song', 'crowd']
export const SupportedAudioFormats = ['.ogg', '.mp3', '.wav', '.opus']

export function isSupportedFile (fileName: string): boolean {
  const File = parse(fileName)
  const FileName = File.name.toLocaleLowerCase()
  const FileExt = File.ext.toLocaleLowerCase()

  if (FileName === 'notes') {
    if (FileExt === '.mid') { return true }
    if (FileExt === '.chart') { return true }
  } else if (FileName === 'song' && FileExt === '.ini') {
    return true
  } else if (FileName === 'video' && SupportedVideoFormats.includes(FileExt)) {
    return true
  } else if (SupportedImageFormats.includes(FileExt)) {
    return true
  } else if (SupportedStemNames.includes(FileName) && SupportedAudioFormats.includes(FileExt)) {
    return true
  } else {
    return false
  }
}

export async function getSupportedFilesDirectory (directory: string): Promise<string[]> {
  const files = await readdir(directory)
  const supportedFiles: string[] = []

  for (let i = 0; i < files.length; i++) {
    const stat = await lstat(join(directory, files[i]))

    if (stat.isSymbolicLink()) { continue }
    if (stat.isDirectory()) { continue }
    if (!isSupportedFile(parse(files[i]).base)) { continue }

    supportedFiles.push(files[i])
  }

  return supportedFiles
}

export function getSupportedFilesDrive (directory: drive_v3.Schema$File[]): [string, string][] {
  const supportedFiles: [string, string][] = []

  for (let i = 0; i < directory.length; i++) {
    if (!isSupportedFile(directory[i].name)) { continue }

    supportedFiles.push([directory[i].id, directory[i].name])
  }

  return supportedFiles
}

export function isValidSongDrive (fileNames: string[]): boolean {
  // eslint-disable-next-line no-param-reassign
  fileNames = fileNames.map((f) => f.toLowerCase())

  let hasChart = false
  let hasini = false
  let hasAudio = false

  for (let i = 0; i < fileNames.length; i++) {
    if (fileNames[i] === 'notes.mid' || fileNames[i] === 'notes.chart') { hasChart = true; continue }
    if (fileNames[i] === 'song.ini') { hasini = true; continue }

    const File = parse(fileNames[i])
    const FileName = File.name.toLocaleLowerCase()
    const FileExt = File.ext.toLocaleLowerCase()

    if (SupportedStemNames.includes(FileName) && SupportedAudioFormats.includes(FileExt)) { hasAudio = true; continue }
  }

  if (hasChart && hasini && hasAudio) { return true }
  return false
}

export async function pathExists (path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export function timeout (time): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time) // 2.5s * retry count
  })
}

export async function getFiles (path: string): Promise<{ path: string, name: string }[]> {
  const entries = await readdir(path, { withFileTypes: true })

  const files = entries.
    filter((entry) => !entry.isDirectory()).
    map((file) => ({ ...file, path: join(path, file.name) }))

  const folders = entries.filter((entry) => entry.isDirectory())

  for (const folder of folders) {
    files.push(...await getFiles(join(path, folder.name)))
  }

  return files
}

export async function findFile (path: string, file: string): Promise<string | null> {
  const files = await readdir(path)

  for (let i = 0; i < files.length; i++) {
    if (files[i].toLowerCase() === file.toLowerCase()) {
      return join(path, file)
    }
  }

  return null
}
