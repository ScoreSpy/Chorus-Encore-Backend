import { readdir, rm } from 'node:fs/promises'
import { join, parse, resolve } from 'node:path'
import PQueue from 'p-queue'
import ffmpeg from 'fluent-ffmpeg'
import os from 'os'

const SupportedFormats = ['.mp4', '.avi', '.vp8', '.ogv', '.mpeg'] // '.webm',

export async function getFiles (dir: string): Promise<string[]> {
  const dirents = await readdir(dir, { withFileTypes: true })

  const files = await Promise.all(dirents.map((dirent) => {
    const res = resolve(dir, dirent.name)
    return dirent.isDirectory() ? getFiles(res) : res
  }))

  return Array.prototype.concat(...files)
}

export function ConvertFile (FileLocation: string): Promise<void> {
  return new Promise((res, reject) => {
    const fileData = parse(FileLocation)

    ffmpeg(FileLocation).
      videoCodec('libvpx').
      videoBitrate(1000, true).
      noAudio().
      outputOptions('-minrate', '1000', '-maxrate', '1000', '-threads', '3', '-flags', '+global_header').
      on('error', (err) => {
        // eslint-disable-next-line no-console
        console.error(`(${FileLocation}) webm conversion error occurred: ${err.message}`)
        reject(err)
      }).
      on('end', () => {
        // eslint-disable-next-line no-console
        console.log(`${fileData.name}${fileData.ext} -> ${fileData.name}.webm`)
        res()
      }).
      save(join(fileData.dir, `${fileData.name}.webm`))
  })
}


export default async function opusConverter (path: string) {
  const files = await getFiles(path)

  const songFileIndex = files.filter((f) => {
    const p = parse(f)
    return SupportedFormats.includes(p.ext.toLowerCase())
  })

  const queue = new PQueue({ concurrency: os.cpus().length })

  for (let index = 0; index < songFileIndex.length; index++) {
    queue.add(async () => {
      await ConvertFile(songFileIndex[index])
      await rm(songFileIndex[index])
    })
  }


  await queue.onIdle()
}
