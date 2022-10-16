/* eslint-disable no-console */
import { createWriteStream } from 'fs'
import { mkdir, readdir, readFile, rm, writeFile } from 'fs/promises'
import { drive_v3 } from 'googleapis'
import { GaxiosResponse } from 'googleapis-common'
import { join, parse } from 'path'
import paths from './../configs/paths'
import { Readable } from 'typeorm/platform/PlatformTools'
import Extract7z from './extractors/7z'
import { fileExists, getFiles, getSupportedFilesDirectory, getSupportedFilesDrive, isValidSongDrive, timeout } from './helpers'
import { GoogleDrive, SearchResults } from './sources/googledrive'
import database from './database'
import { ChartFormat } from './../types'
import { combineChartData, combineMidiData } from './combineChartData'
import * as parsers from './parsers'
import { charts } from './../orm/entity/charts'
import PQueue from 'p-queue'
import SnowflakeUtil from './snowflake'
import archiver from './archive'
import runtime from './../configs/runtime'
import iniConstructor from './iniConstructor'
import opusConverter from './converters/opusConverter'
// import imageConverter from './converters/imageConverter'

export default async function processSongs (songs: SearchResults) {
  const queue = new PQueue({ concurrency: runtime.driveDownloadThreads })

  const keys7z = Array.from(songs.Archives7z.keys())
  for (let i = 0; i < keys7z.length; i++) {
    const data = songs.Archives7z.get(keys7z[i])
    queue.add(() => HandleArchive(data))
  }

  const keysRAR = Array.from(songs.ArchivesRAR.keys())
  for (let i = 0; i < keysRAR.length; i++) {
    const data = songs.ArchivesRAR.get(keysRAR[i])
    queue.add(() => HandleArchive(data))
  }

  const keysZip = Array.from(songs.ArchivesZip.keys())
  for (let i = 0; i < keysZip.length; i++) {
    const data = songs.ArchivesZip.get(keysZip[i])
    queue.add(() => HandleArchive(data))
  }

  const keysFolders = Array.from(songs.SongFolders.keys())
  for (let i = 0; i < keysFolders.length; i++) {
    const data = songs.SongFolders.get(keysFolders[i])
    queue.add(() => HandleFolder(data, keysFolders[i]))
  }

  await queue.onIdle()
  console.log('queue idle')
}

async function DownloadFile (destDir: string, id: string, options = { retryLimit: 3 }, retrys = 0) {
  let res: GaxiosResponse<Readable> = null
  try {
    res = await GoogleDrive.files.get({ fileId: id, alt: 'media' }, { responseType: 'stream' })
  } catch (error) {
    console.error(error)

    if (retrys > options.retryLimit) { throw new Error('retry limit exceeded') }
    // eslint-disable-next-line no-param-reassign
    retrys += 1
    await timeout(2500 * retrys)

    return DownloadFile(destDir, id, options, retrys)
  }

  const dest = createWriteStream(destDir)
  return new Promise((resolve) => {
    res.data.pipe(dest)
    res.data.on('end', resolve)
    res.data.on('error', async (error) => {
      // eslint-disable-next-line no-console
      console.error(error)

      if (retrys > options.retryLimit) { throw new Error('retry limit exceeded') }
      // eslint-disable-next-line no-param-reassign
      retrys += 1
      await timeout(2500 * retrys)

      return DownloadFile(destDir, id, options, retrys)
    })
  })
}


async function HandleArchive (file: drive_v3.Schema$File) {
  await mkdir(join(paths.extraction, file.id))

  try {
    await DownloadFile(join(paths.extraction, file.id, 'archive'), file.id)
    await Extract7z(join(paths.extraction, file.id, 'archive'), join(paths.extraction, file.id))
    await rm(join(paths.extraction, file.id, 'archive'))
  } catch (error) {
    console.log('download failed, cleaning up')
    await rm(join(paths.extraction, file.id), { recursive: true, force: true })
  }

  await tryProcessSong(join(paths.extraction, file.id), file.id)
}

async function HandleFolder (files: drive_v3.Schema$File[], folderId: string) {
  await mkdir(join(paths.extraction, folderId))

  try {
    const supportedFiles = await getSupportedFilesDrive(files)
    for (let i = 0; i < supportedFiles.length; i++) {
      await DownloadFile(join(paths.extraction, folderId, supportedFiles[i][1]), supportedFiles[i][0])
    }
  } catch (error) {
    console.log('download failed, cleaning up')
    await rm(join(paths.extraction, folderId), { recursive: true, force: true })
  }

  await tryProcessSong(join(paths.extraction, folderId), folderId)
}

async function tryProcessSong (path: string, source_id: string) {
  try {
    await ProcSong(path, source_id)
    console.log('Processed', source_id)
  } catch (error) {
    console.error('Error Processing', source_id)
    console.error(error)
  } finally {
    await rm(path, { recursive: true, force: true })
  }
}

async function ProcSong (path: string, source_id: string) {
  const dir = await getFiles(path)

  // look for chart files first
  let baseFolder = ''
  let chartType: ChartFormat = null

  for (let i = 0; i < dir.length; i++) {
    if (dir[i].name.toLowerCase().endsWith('.chart')) {
      chartType = ChartFormat.CHART
      baseFolder = parse(dir[i].path).dir
    }
  }

  if (chartType === null) {
    for (let i = 0; i < dir.length; i++) {
      if (dir[i].name.toLowerCase().endsWith('.mid')) {
        chartType = ChartFormat.MIDI
        baseFolder = parse(dir[i].path).dir
      }
    }
  }

  if (chartType === null) {
    throw new Error('no chart found')
  }

  const files = await readdir(baseFolder)
  if (!isValidSongDrive(files)) {
    throw new Error('invalid chart folder')
  }

  const supportedFiles = await getSupportedFilesDirectory(baseFolder)
  const iniFile = supportedFiles.filter((s) => s.toLowerCase() === 'song.ini')[0]
  const iniData = parsers.parseIni(await readFile(join(baseFolder, iniFile)))

  let data: charts = null
  if (chartType === ChartFormat.CHART) {
    const chartFile = supportedFiles.filter((s) => s.toLowerCase() === 'notes.chart')[0]
    const chartData = parsers.parseChart(await readFile(join(baseFolder, chartFile)))

    data = combineChartData(iniData, chartData)
  } else if (chartType === ChartFormat.MIDI) {
    const midiFile = supportedFiles.filter((s) => s.toLowerCase() === 'notes.mid')[0]
    const midiData = parsers.parseMidi(await readFile(join(baseFolder, midiFile)))

    data = combineMidiData(iniData, midiData)
  } else {
    throw new Error('unsupported chart format')
  }

  data.source_id = source_id
  data.snowflake = SnowflakeUtil.generate(1, 1)
  const dest = join(paths.store, `${data.snowflake}.tar`)

  await rm(join(baseFolder, iniFile), { force: true })
  const iniString = iniConstructor(data)
  await writeFile(join(baseFolder, 'song.ini'), iniString)

  await opusConverter(baseFolder)
  // await imageConverter(baseFolder)

  if (await fileExists(dest)) { throw new Error('archive exists') }
  const archiveBuffer = (await archiver(baseFolder, `${data.snowflake}.tar`)).buffer

  await database.charts.save(data)
  await writeFile(dest, archiveBuffer)
}
