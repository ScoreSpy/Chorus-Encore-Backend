/* eslint-disable no-console */
import { Credentials } from 'google-auth-library'
import { drive_v3, google } from 'googleapis'
import database from './../database'
import googleCreds from './../../configs/google'
import { getSupportedFilesDrive, isValidSongDrive, timeout } from '../helpers'
import fs, { rm } from 'fs/promises'
import { createWriteStream } from 'fs'
import paths from './../../configs/paths'
import { join } from 'path'
import Extract7z from '../extractors/7z'
import { GaxiosResponse } from 'gaxios'
import { Readable } from 'typeorm/platform/PlatformTools'

export type SearchResults = { Archives7z: string[], ArchivesRAR: string[], ArchivesZip: string[], SongFolders: string[] }

export const Oauth2Client = new google.auth.OAuth2(googleCreds.id, googleCreds.secret, 'http://localhost')
const GoogleDrive = google.drive({ version: 'v3', auth: Oauth2Client })

async function GetCredentials (): Promise<void> {
  const token = (await database.s_variables.findOneBy({ key: 'googleCredentials' })).value
  if (!token) { throw new Error('No GoogleAPI credentials') }

  const googleCredentials: Credentials = { refresh_token: token }
  Oauth2Client.setCredentials(googleCredentials)
}

Oauth2Client.on('tokens', () => {
  // Oauth2Client.setCredentials(tokens)
  console.log('Oauth2Client.on tokens')
})

function isCredentialsValid (): boolean {
  if (!Oauth2Client.credentials.expiry_date) { return false }
  if (new Date().getTime() >= Oauth2Client.credentials.expiry_date) { return false }
  return true
}

async function ScanRecursive (sourceId: string, doneList: string[], foundSongs: SearchResults) {
  if (doneList.includes(sourceId)) { return }
  doneList.push(sourceId)

  const res = await GoogleDrive.files.list({ q: `'${sourceId}' in parents`, pageSize: 1000 }, { responseType: 'json' })

  const { files } = res.data

  if (res.data.nextPageToken) {
    let tokenString = res.data.nextPageToken

    while (tokenString) {
      const subData = await GoogleDrive.files.list({ q: `'${sourceId}' in parents`, pageToken: tokenString, pageSize: 1000 }, { responseType: 'json' })
      console.log(`${tokenString} ${subData.data.files.length}`)
      console.log(subData.data)
      tokenString = subData.data.nextPageToken
      files.concat(subData.data.files)
    }
  }

  for (let i = 0; i < files.length; i++) {
    // console.log(files[i].webContentLink)
    if (files[i].mimeType === 'application/vnd.google-apps.shortcut') {
      // parse folder
      const shortcut = await GoogleDrive.files.get({ fileId: files[i].id, fields: 'shortcutDetails' })
      console.log('fScanRecursive link', files[i].name)
      await ScanRecursive(shortcut.data.shortcutDetails.targetId, doneList, foundSongs)
    } else if (files[i].mimeType === 'application/vnd.google-apps.folder') {
      console.log('fScanRecursive folder', files[i].name)
      await ScanRecursive(files[i].id, doneList, foundSongs)
    } else if (files[i].mimeType === 'application/x-7z-compressed') {
      console.log('found valid Archive7z', files[i].name)
      foundSongs.Archives7z.push(files[i].id)
      await HandleArchive(files[i])
    } else if (files[i].mimeType === 'application/rar') {
      console.log('found valid ArchiveRAR', files[i].name)
      foundSongs.ArchivesRAR.push(files[i].id)
      await HandleArchive(files[i])
    } else if (files[i].mimeType === 'application/x-zip-compressed') {
      console.log('found valid ArchiveZip', files[i].name)
      foundSongs.ArchivesZip.push(files[i].id)
      await HandleArchive(files[i])
    } else {
      // console.log(`INVALID TYPE: ${files[i].mimeType} ${files[i].name}`)
      if (foundSongs.SongFolders.includes(sourceId)) { continue }
      if (!files[i].name.toLowerCase().endsWith('.chart') && !files[i].name.toLowerCase().endsWith('.mid')) { continue }
      if (!isValidSongDrive(files.map((f) => f.name))) { continue }
      console.log('found valid song folder')
      await HandleFolder(files, sourceId)
      foundSongs.SongFolders.push(sourceId)
    }
  }
}

async function DownloadFile (destDir: string, id: string, options = { retryLimit: 3 }, retrys = 0) {
  console.log('downloading', destDir)

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
  await fs.mkdir(join(paths.extraction, file.id))

  try {
    await DownloadFile(join(paths.extraction, file.id, 'archive'), file.id)
    await Extract7z(join(paths.extraction, file.id, 'archive'), join(paths.extraction, file.id))
    console.log('extracted', join(paths.extraction, file.id, 'archive'))
    await rm(join(paths.extraction, file.id, 'archive'))
    console.log('deleted', join(paths.extraction, file.id, 'archive'))
  } catch (error) {
    console.log('download failed, cleaning up')
    await rm(join(paths.extraction, file.id), { recursive: true, force: true })
  }


  // await parseFolder(file)
}

async function HandleFolder (files: drive_v3.Schema$File[], folderId: string) {
  await fs.mkdir(join(paths.extraction, folderId))

  try {
    const supportedFiles = await getSupportedFilesDrive(files)
    for (let i = 0; i < supportedFiles.length; i++) {
      await DownloadFile(join(paths.extraction, folderId, supportedFiles[i][1]), supportedFiles[i][0])
    }
  } catch (error) {
    console.log('download failed, cleaning up')
    await rm(join(paths.extraction, folderId), { recursive: true, force: true })
  }


  // await parseFolder(file)
}

/*
 * async function parseFolder (file: drive_v3.Schema$File) {
 *
 * }
 */

export default async function CrawlRecursive () {
  if (!isCredentialsValid()) { await GetCredentials() }

  const driveLinks: string[] = []

  const foundSongs: SearchResults = {
    Archives7z: [],
    ArchivesRAR: [],
    ArchivesZip: [],
    SongFolders: []
  }

  await ScanRecursive('1kgPCEt990poTNQC5tM0x8ghKOLVgDIZt', driveLinks, foundSongs)

  /*
   * await ScanRecursive('1NqgS3ZcgtJkawaptp49WKbXR4MIohoiU', driveLinks, foundSongs)
   * await ScanRecursive('1aLXbFIFQto22MNa_hfkyeXCrAVbZsPj-', driveLinks, foundSongs)
   * await ScanRecursive('1AvmWyROT4qECfvwwq8hXy5Bye2bDCB6J', driveLinks, foundSongs)
   * await ScanRecursive('1vex6WDlj70XjUHTU1Y0yvKDx1060-71E', driveLinks, foundSongs)
   * await ScanRecursive('1AL_ilZu_di83Kt1o6EfVDCp5qpLAIhfT', driveLinks, foundSongs)
   * await ScanRecursive('1T9NnI2P00FAJpgEF7nW_OUARRwWdz_ic', driveLinks, foundSongs)
   * await ScanRecursive('1daRhysvylcEAvR8iGsnV-Kxy1C19x3d8', driveLinks, foundSongs)
   * await ScanRecursive('1NYj77jI1i77FQfpjdrgLEkMDNEnpPunL', driveLinks, foundSongs)
   * await ScanRecursive('15zIFxkBDPUceLacBsLIZWvbOeM3HmdWw', driveLinks, foundSongs)
   */

  console.log('-- RESULTS --')
  console.log(`Archives7z: ${foundSongs.Archives7z.length}`)
  console.log(`ArchivesRAR: ${foundSongs.ArchivesRAR.length}`)
  console.log(`ArchivesZip: ${foundSongs.ArchivesZip.length}`)
  console.log(`SongFolders: ${foundSongs.SongFolders.length}`)
}

