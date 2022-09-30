import { getSupportedFilesDirectory } from './helpers'

export default async function songParser (path: string) {
  const supportedFiles = await getSupportedFilesDirectory(path)
  // eslint-disable-next-line no-console
  console.log(supportedFiles)
}
