import { readdir, rm, writeFile } from 'node:fs/promises'
import { join, parse, resolve } from 'node:path'
import PQueue from 'p-queue'
import os from 'os'
import sharp from 'sharp'

const SupportedFormats = ['.jpeg', '.jpg']

const lookupTable = new Map([['album', [512, 512]]])

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

  let buff = null
  try {
    const data = lookupTable.get(fileData.name.toLowerCase())
    buff = await sharp(FileLocation).resize(data[0], data[1]).png().toBuffer()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`(${FileLocation}) png conversion error occurred: ${error.message}`)
  }

  await writeFile(outputFile, buff)
  // eslint-disable-next-line no-console
  console.log(`${fileData.name}${fileData.ext} -> ${fileData.name}.png`)
}

export default async function opusConverter (path: string) {
  const files = await getFiles(path)

  const songFileIndex = files.filter((f) => {
    const p = parse(f)
    if (!SupportedFormats.includes(p.ext.toLowerCase())) { return false }
    if (!lookupTable.has(p.name.toLowerCase())) { return false }
    return true
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
