import config from './json/runtime.json'

export default {
  get driveScanThreads (): number {
    if ('SS_runtime_drivescanthreads' in process.env) { return parseInt(process.env.SS_runtime_drivescanthreads, 10) }
    return config.driveScanThreads
  },
  get driveDownloadThreads (): number {
    if ('SS_runtime_drivedownloadthreads' in process.env) { return parseInt(process.env.SS_runtime_drivedownloadthreads, 10) }
    return config.driveDownloadThreads
  }
}
