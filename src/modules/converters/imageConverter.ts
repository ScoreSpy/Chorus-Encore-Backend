import { readdir, rm, writeFile } from 'node:fs/promises'
import { join, parse, resolve } from 'node:path'
import PQueue from 'p-queue'
import os from 'os'
import sharp from 'sharp'

const SupportedFormats = ['.jpeg', '.jpg']

export async function getFiles (dir: string): Promise<string[]> {
  const dirents = await readdir(dir, { withFileTypes: true })

  const files = await Promise.all(dirents.map((dirent) => {
    const res = resolve(dir, dirent.name)
    return dirent.isDirectory() ? getFiles(res) : res
  }))

  return Array.prototype.concat(...files)
}

export async function ConvertFile (FileLocation: string): Promise<void> {
  const fileData = parse(FileLocation)
  const outputFile = join(fileData.dir, `${fileData.name}.png`)

  const buff = await sharp(FileLocation).png().toBuffer()
  await writeFile(outputFile, buff)
  // eslint-disable-next-line no-console
  console.log(`${fileData.name}${fileData.ext} -> ${fileData.name}.png`)
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
