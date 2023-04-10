import { drive_v3, google } from 'googleapis'
import googleCreds from './../configs/google'
import { deleteMissingFilesFromDb, insertNewFilesToDb } from './database/archives'
import database from './database'

export interface File {
  id: string
  name: string
  mimeType: string
  md5Checksum: string
  folderId: string
  createdTime: Date
}

async function findFilesWithExtension (folderId: string, extension: string, drive: drive_v3.Drive): Promise<File[]> {
  const files: File[] = []

  const query = `'${folderId}' in parents and trashed = false`
  const { data } = await drive.files.list({ q: query, fields: 'files(createdTime, modifiedTime, id, name, mimeType, md5Checksum, parents)' })

  if (!data) { return files }
  if (!data.files) { return files }

  for (const file of data.files) {
    if (!file || !file.id) { continue }

    if (file.mimeType === 'application/vnd.google-apps.folder') {
      const subFiles = await findFilesWithExtension(file.id, extension, drive)

      files.push(...subFiles.map((s) => {
        s.createdTime = new Date(file.createdTime as string)
        return s
      }))
    } else if (file.name && file.name.endsWith(`.${extension}`)) {
      if (!file.mimeType || !file.md5Checksum) { continue }
      file.md5Checksum = file.md5Checksum.toUpperCase()
      files.push({ id: file.id, name: file.name, mimeType: file.mimeType, md5Checksum: file.md5Checksum, folderId, createdTime: new Date(file.createdTime as string) })
    }
  }

  return files
}

async function updateEntries (files: File[]) {
  const deletedEntries = await deleteMissingFilesFromDb(files)
  console.log(`Removed ${deletedEntries.length} orphaned files`)

  const insertedEntries = await insertNewFilesToDb(files)
  console.log(`Inserted ${insertedEntries.length} new files`)
}

export default async function ScanCE () {
  const auth = new google.auth.GoogleAuth({
    credentials: { type: googleCreds.type, private_key: googleCreds.private_key, client_email: googleCreds.client_email, client_id: googleCreds.client_id },
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
  })

  const authClient = await auth.getClient()
  const drive = google.drive({ version: 'v3', auth: authClient })
  const drives = await database.user.find({ select: ['drive_id'] })

  for (let i = 0; i < drives.length; i++) {
    const ceFiles = await findFilesWithExtension(drives[i].drive_id, 'ce', drive)

    console.log(`Found ${ceFiles.length} files with the ".ce" extension.`)
    console.log(ceFiles)

    await updateEntries(ceFiles)
  }
}

