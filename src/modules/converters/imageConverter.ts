import { getRootFiles } from './../helpers'
import { join, parse } from 'node:path'
import { rm, writeFile } from 'node:fs/promises'
import os from 'os'
import PQueue from 'p-queue'
import sharp from 'sharp'

const SupportedFormats = ['.jpeg', '.jpg']
const lookupTable = new Map([['album', [512, 512]]])

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

export default async function imageConverter (path: string) {
  const files = await getRootFiles(path)

  const songFileIndex = files.filter((f) => {
    const p = parse(f.name)
    if (!SupportedFormats.includes(p.ext.toLowerCase())) { return false }
    if (!lookupTable.has(p.name.toLowerCase())) { return false }
    return true
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
