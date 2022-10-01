import { sourceGoogleDrive } from './sources'

const sourceDrive = 'https://drive.google.com/drive/u/1/folders/1kgPCEt990poTNQC5tM0x8ghKOLVgDIZt'

export default function debug (): void {
  sourceGoogleDrive().then(() => { console.log('awoo') })
}
