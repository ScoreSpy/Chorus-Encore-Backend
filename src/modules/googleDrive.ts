import { drive_v3, google } from 'googleapis'
import googleCreds from './../configs/google'

async function searchDriveFolder (folderId: string, drive: drive_v3.Drive, foundFiles: drive_v3.Schema$File[] = []): Promise<drive_v3.Schema$File[]> {
  const { data: { files } } = await drive.files.list({ q: `'${folderId}' in parents`, fields: 'nextPageToken, files(id, name, mimeType)' })
  if (!files) { return foundFiles }

  const ceFiles = files.filter((file) => file.mimeType !== 'application/vnd.google-apps.folder' && file.name && file.name.endsWith('.ce'))
  foundFiles.push(...ceFiles)

  const subfolders = files.filter((file) => file.mimeType === 'application/vnd.google-apps.folder')

  for (const subfolder of subfolders) {
    const subfolderId = subfolder.id
    if (!subfolderId) { continue }

    await searchDriveFolder(subfolderId, drive, foundFiles)
  }

  return foundFiles
}

export default async function ScanCE () {
  const auth = new google.auth.GoogleAuth({
    credentials: { type: googleCreds.type, private_key: googleCreds.private_key, client_email: googleCreds.client_email, client_id: googleCreds.client_id },
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
  })

  const authClient = await auth.getClient()
  const drive = google.drive({ version: 'v3', auth: authClient })

  const rootFolderId = '10X6qBMXU21HBmQUQrsq67pZQwi5IR8Ye'
  const ceFiles = await searchDriveFolder(rootFolderId, drive)

  console.log(`Found ${ceFiles.length} files with the ".ce" extension.`)
  console.log(ceFiles.map((file) => file.name))
}
