import config from './json/paths.json'

export default {
  get extraction (): string {
    if ('SS_paths_extaction' in process.env) { return process.env.SS_paths_extraction }
    return config.extraction
  },
  get store (): string {
    if ('SS_paths_store' in process.env) { return process.env.SS_paths_store }
    return config.store
  }
}
