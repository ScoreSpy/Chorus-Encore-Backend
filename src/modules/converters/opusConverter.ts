import { getRootFiles } from './../helpers'
import { join, parse } from 'node:path'
import { rm } from 'node:fs/promises'
import ffmpeg from 'fluent-ffmpeg'
import os from 'os'
import PQueue from 'p-queue'

const SupportedFormats = ['.ogg', '.mp3', '.wav']

export function ConvertFile (FileLocation: string): Promise<void> {
  return new Promise((res, reject) => {
    const fileData = parse(FileLocation)

    ffmpeg(FileLocation).
      audioCodec('libopus').
      on('error', (err) => {
        // eslint-disable-next-line no-console
        console.error(`(${FileLocation}) opus conversion error occurred: ${err.message}`)
        reject(err)
      }).
      on('end', () => {
        // eslint-disable-next-line no-console
        console.log(`${fileData.name}${fileData.ext} -> ${fileData.name}.opus`)
        res()
      }).
      save(join(fileData.dir, `${fileData.name}.opus`))
  })
}

export default async function opusConverter (path: string) {
  const files = await getRootFiles(path)

  const songFileIndex = files.filter((f) => {
    const p = parse(f.name)
    return SupportedFormats.includes(p.ext.toLowerCase())
  })

  const queue = new PQueue({ concurrency: os.cpus().length })

  for (let index = 0; index < songFileIndex.length; index++) {
    queue.add(async () => {
      await ConvertFile(songFileIndex[index].path)
      await rm(songFileIndex[index].path)
    })
  }


  await queue.onIdle()
}
