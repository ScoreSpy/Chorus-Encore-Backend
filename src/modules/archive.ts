import { archiveStreamToBuffer, getSupportedFilesDirectory } from './helpers'
import archiver from 'archiver'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { PassThrough } from 'stream'

export default async function CreateArchive (source: string, dest: string) {
  const archive = archiver('tar', { zlib: { level: 9 } })
  const packageFiles = await getSupportedFilesDirectory(source)

  for (let i = 0; i < packageFiles.length; i++) {
    archive.append(await readFile(join(source, packageFiles[i])), { name: packageFiles[i] })
  }

  const passThough = new PassThrough()
  archive.pipe(passThough)
  const fileData = await archiveStreamToBuffer(passThough, dest, archive)

  return fileData
}
