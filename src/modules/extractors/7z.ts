import { pathExists } from './../helpers'
import Seven from 'node-7z'

// 7z handles 7z, rar and zip.. so that meakes things easier..
export default async function Extract7z (sourceFileLocation: string, destinationFolder: string): Promise<void> {
  if (!await pathExists(sourceFileLocation)) { throw new Error('Extract7z: source path does not exist') }
  if (!await pathExists(destinationFolder)) { throw new Error('Extract7z: destination path does not exist') }

  return new Promise((resolve, reject) => {
    const myStream = Seven.extractFull(sourceFileLocation, destinationFolder, { $progress: false })

    /*
     * myStream.on('data', (data) => { })
     * myStream.on('progress', (progress) => { })
     */

    myStream.on('end', () => {
      resolve()
    })

    myStream.on('error', (err) => reject(err))
  })
}
