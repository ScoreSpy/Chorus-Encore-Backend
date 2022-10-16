/* eslint-disable no-console */
import { Credentials } from 'google-auth-library'
import { drive_v3, google } from 'googleapis'
import database from './../database'
import googleCreds from './../../configs/google'
import { isValidSongDrive } from '../helpers'
import processSongs from './../songProcessor'
import PQueue, { DefaultAddOptions } from 'p-queue'
import PriorityQueue from 'p-queue/dist/priority-queue'
import runtime from './../../configs/runtime'

export type SearchResults = { Archives7z: Map<string, drive_v3.Schema$File>, ArchivesRAR: Map<string, drive_v3.Schema$File>, ArchivesZip: Map<string, drive_v3.Schema$File>, SongFolders: Map<string, drive_v3.Schema$File[]> }

export const Oauth2Client = new google.auth.OAuth2(googleCreds.id, googleCreds.secret, 'http://localhost')
export const GoogleDrive = google.drive({ version: 'v3', auth: Oauth2Client })

async function GetCredentials (): Promise<void> {
  const token = (await database.s_variables.findOneBy({ key: 'googleCredentials' })).value
  if (!token) { throw new Error('No GoogleAPI credentials') }

  const googleCredentials: Credentials = { refresh_token: token }
  Oauth2Client.setCredentials(googleCredentials)
}

function isCredentialsValid (): boolean {
  if (!Oauth2Client.credentials.expiry_date) { return false }
  if (new Date().getTime() >= Oauth2Client.credentials.expiry_date) { return false }
  return true
}

async function ScanRecursive (queue: PQueue<PriorityQueue, DefaultAddOptions>, sourceId: string, doneList: string[], foundSongs: SearchResults) {
  if (doneList.includes(sourceId)) { return }
  doneList.push(sourceId)

  const res = await GoogleDrive.files.list({ q: `'${sourceId}' in parents`, pageSize: 1000, fields: 'files(md5Checksum,originalFilename,name,kind,id,mimeType)' }, { responseType: 'json' })

  const { files } = res.data

  if (res.data.nextPageToken) {
    let tokenString = res.data.nextPageToken

    while (tokenString) {
      const subData = await GoogleDrive.files.list({ q: `'${sourceId}' in parents`, pageToken: tokenString, pageSize: 1000, fields: 'files(md5Checksum,originalFilename,name,kind,id,mimeType)' }, { responseType: 'json' })
      console.log(`${tokenString} ${subData.data.files.length}`)
      console.log(subData.data)
      tokenString = subData.data.nextPageToken
      files.concat(subData.data.files)
    }
  }

  for (let i = 0; i < files.length; i++) {
    if (files[i].mimeType === 'application/vnd.google-apps.shortcut') {
      // handle shortcuts
      const shortcut = await GoogleDrive.files.get({ fileId: files[i].id, fields: 'shortcutDetails' })
      console.log('fScanRecursive link', files[i].name)

      // await ScanRecursive(shortcut.data.shortcutDetails.targetId, doneList, foundSongs)
      queue.add(() => ScanRecursive(queue, shortcut.data.shortcutDetails.targetId, doneList, foundSongs))
    } else if (files[i].mimeType === 'application/vnd.google-apps.folder') {
      // handle folders
      console.log('fScanRecursive folder', files[i].name)

      // await ScanRecursive(files[i].id, doneList, foundSongs)
      queue.add(() => ScanRecursive(queue, files[i].id, doneList, foundSongs))
    } else if (files[i].mimeType === 'application/x-7z-compressed') {
      // handle 7zip
      console.log('found valid Archive7z', files[i].name)
      foundSongs.Archives7z.set(files[i].id, files[i])
    } else if (files[i].mimeType === 'application/rar') {
      // handle rar
      console.log('found valid ArchiveRAR', files[i].name)
      foundSongs.ArchivesRAR.set(files[i].id, files[i])
    } else if (files[i].mimeType === 'application/x-zip-compressed') {
      // handle zip
      console.log('found valid ArchiveZip', files[i].name)
      foundSongs.ArchivesZip.set(files[i].id, files[i])
    } else {
      // handle folder contents
      if (foundSongs.SongFolders.has(sourceId)) { continue }
      if (!files[i].name.toLowerCase().endsWith('.chart') && !files[i].name.toLowerCase().endsWith('.mid')) { continue }
      if (!isValidSongDrive(files.map((f) => f.name))) { continue }
      console.log('found valid song folder')

      foundSongs.SongFolders.set(sourceId, files)
    }
  }
}

export default async function CrawlRecursive () {
  if (!isCredentialsValid()) { await GetCredentials() }

  const driveLinks: string[] = []

  const foundSongs: SearchResults = {
    Archives7z: new Map(),
    ArchivesRAR: new Map(),
    ArchivesZip: new Map(),
    SongFolders: new Map()
  }

  const queue = new PQueue({ concurrency: runtime.driveScanThreads })


  await ScanRecursive(queue, '1p1XuIwYmndRK8Z0VK-uQtnhQEqCBbM9D', driveLinks, foundSongs)

  // await ScanRecursive('1p1XuIwYmndRK8Z0VK-uQtnhQEqCBbM9D', driveLinks, foundSongs) // misc drive
  /*
   * await ScanRecursive('1kgPCEt990poTNQC5tM0x8ghKOLVgDIZt', driveLinks, foundSongs) // CSC Charters
   * await ScanRecursive('1pfqNMLkN2n7nsdT0TIBVPhjsFnsIRYt8', driveLinks, foundSongs) // test drive
   */

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

  await queue.onIdle()

  console.log('-- RESULTS --')
  console.log(`Archives7z: ${foundSongs.Archives7z.size}`)
  console.log(`ArchivesRAR: ${foundSongs.ArchivesRAR.size}`)
  console.log(`ArchivesZip: ${foundSongs.ArchivesZip.size}`)
  console.log(`SongFolders: ${foundSongs.SongFolders.size}`)

  await processSongs(foundSongs)
}

