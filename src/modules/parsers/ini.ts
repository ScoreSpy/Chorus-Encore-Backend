import Iconv from 'iconv-lite'

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
  diff_band?: string
  diff_bass?: string
  diff_bassghl?: string
  diff_drums?: string
  diff_guitar?: string
  diff_guitarghl?: string
  diff_keys?: string
  diff_rhythm?: string
  frets?: string
  genre?: string
  icon?: string
  loading_phrase?: string
  name?: string
  playlist_track?: string
  song_length?: string
  track?: string
  year?: string
}

export default function parseIni (ini: Buffer): ChorusIni | null {
  try {
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
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.stack)
    return null
  }
}
