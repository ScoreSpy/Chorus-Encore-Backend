import { charts } from './../orm/entity/charts'

export default function iniConstructor (chart: charts): string {
  const baseObject = {
    album_track: chart.ini_album_track,
    album: chart.ini_album,
    artist: chart.ini_artist,
    charter: chart.ini_charter,
    diff_band: chart.ini_diff_band,
    diff_bass: chart.ini_diff_bass,
    diff_bassghl: chart.ini_diff_bassghl,
    diff_drums_real: chart.ini_diff_drums,
    diff_drums: chart.ini_diff_drums,
    diff_guitar_coop: chart.ini_diff_guitar_coop,
    diff_guitar: chart.ini_diff_guitar,
    diff_guitarghl: chart.ini_diff_guitarghl,
    diff_keys: chart.ini_diff_keys,
    diff_rhythm: chart.ini_diff_rhythm,
    five_lane_drums: chart.ini_five_lane_drums,
    genre: chart.ini_genre,
    icon: chart.ini_icon,
    loading_phrase: chart.ini_loading_phrase,
    modchart: chart.ini_modchart,
    name: chart.ini_name,
    playlist_track: chart.ini_playlist_track,
    pro_drums: chart.ini_pro_drums,
    song_length: chart.ini_song_length,
    track: chart.ini_track,
    year: chart.ini_year
  }

  const keys = Object.keys(baseObject)
  let iniString = '[Song]'

  for (let i = 0; i < keys.length; i++) {
    if (typeof baseObject[keys[i]] === 'undefined' || baseObject[keys[i]] === null) { continue }
    iniString += `\n${keys[i]} = ${baseObject[keys[i]]}`
  }

  return iniString
}
