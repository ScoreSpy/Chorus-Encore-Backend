import { archives } from './../../orm/entity/archives'
import database from './../database'
import type { File } from './../googleDrive'

export async function deleteMissingFilesFromDb (files: File[]): Promise<archives[]> {
  const existingFiles = await database.archives.find()
  const deletedFiles: archives[] = []

  for (const existingFile of existingFiles) {
    const matchingFile = files.find((file) => file.md5Checksum === existingFile.checksum &&
      file.folderId === existingFile.drive_id &&
      file.id === existingFile.file_id)

    if (!matchingFile) {
      await database.archives.remove(existingFile)
      deletedFiles.push(existingFile)
    }
  }

  return deletedFiles
}

export async function insertNewFilesToDb (files: File[]): Promise<File[]> {
  const newFiles: File[] = []

  for (const file of files) {
    const existingFile = await database.archives.findOne({
      where: {
        checksum: file.md5Checksum,
        drive_id: file.folderId,
        file_id: file.id
      }
    })

    if (!existingFile) {
      const newFile = new archives()
      newFile.checksum = file.md5Checksum
      newFile.drive_id = file.folderId
      newFile.file_id = file.id
      newFile.name = file.name
      newFile.google_created = file.createdTime
      await database.archives.save(newFile)
      newFiles.push(file)
    }
  }

  return newFiles
}
