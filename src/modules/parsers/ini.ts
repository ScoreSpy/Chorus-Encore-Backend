// Ported and updated from https://github.com/Paturages/chorus/blob/master/src/utils/meta/ini.js with permission from Paturages

import Iconv from 'iconv-lite'
import logger from './../log'

const log = logger.createContext('parser/ini')

const fieldBlacklist = {
  link: true,
  source: true,
  lastModified: true
}

export type ChorusIni = {
  album_track?: string
  album?: string
  artist?: string
  charter?: string
  delay?: string
  diff_band?: string
  diff_bass?: string
  diff_bassghl?: string
  diff_drums_real?: string
  diff_drums?: string
  diff_guitar_coop?: string
  diff_guitar?: string
  diff_guitarghl?: string
  diff_keys?: string
  diff_rhythm?: string
  end_events?: string
  five_lane_drums?: string
  frets?: string
  genre?: string
  hopo_frequency?: string
  icon?: string
  loading_phrase?: string
  modchart?: string
  multiplier_note?: string
  name?: string
  playlist_track?: string
  preview_start_time?: string
  pro_drums?: string
  song_length?: string
  sustain_cutoff_threshold?: string
  track?: string
  video_start_time?: string
  year?: string
}

function parse (ini: Buffer): ChorusIni | null {
  let source = Iconv.decode(ini, 'utf8')

  if (source.indexOf('�') > -1) { source = Iconv.decode(ini, 'latin-1') }
  if (source.indexOf('\u0000') > -1) { source = Iconv.decode(ini, 'utf16') }

  return source.split('\n').
    reduce((meta, line) => {
      // eslint-disable-next-line prefer-named-capture-group
      const [, param, value] = line.match(/([^=]+)=(.+)/u) || []

      if (!value || !value.trim() || fieldBlacklist[param]) { return meta }

      // eslint-disable-next-line prefer-named-capture-group
      return Object.assign(meta, { [param.trim()]: value.trim().replace(/<[^>]*(b|i|color|size|material|quad)[^>]*>/ug, '') })
    }, {})
}

export default function parseIni (midiFile: Buffer): ChorusIni | null {
  try {
    return parse(midiFile)
  } catch (err) {
    log.error(err)
    return null
  }
}
