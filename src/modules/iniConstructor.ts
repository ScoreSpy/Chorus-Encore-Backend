import { charts } from './../orm/entity/charts'

export default function iniConstructor (chart: charts): string {
  const baseObject = {
    name: chart.ini_name,
    artist: chart.ini_artist,
    album: chart.ini_album,
    genre: chart.ini_genre,
    year: chart.ini_year,
    charter: chart.ini_charter,
    icon: chart.ini_icon,
    diff_band: chart.ini_diff_band,
    diff_bass: chart.ini_diff_bass,
    diff_bassghl: chart.ini_diff_bassghl,
    diff_drums_real: chart.ini_diff_drums_real,
    diff_drums: chart.ini_diff_drums,
    diff_guitar_coop: chart.ini_diff_guitar_coop,
    diff_guitar: chart.ini_diff_guitar,
    diff_guitarghl: chart.ini_diff_guitarghl,
    diff_keys: chart.ini_diff_keys,
    diff_rhythm: chart.ini_diff_rhythm,
    album_track: chart.ini_album_track,
    track: chart.ini_track,
    playlist_track: chart.ini_playlist_track,
    song_length: chart.ini_song_length,
    preview_start_time: chart.ini_preview_start_time,
    video_start_time: chart.ini_video_start_time,
    pro_drums: chart.ini_pro_drums,
    five_lane_drums: chart.ini_five_lane_drums,
    modchart: chart.ini_modchart,
    loading_phrase: chart.ini_loading_phrase
  }

  const keys = Object.keys(baseObject)
  let iniString = '[Song]'

  for (let i = 0; i < keys.length; i++) {
    if (typeof baseObject[keys[i]] === 'undefined' || baseObject[keys[i]] === null) { continue }
    iniString += `\n${keys[i]} = ${baseObject[keys[i]]}`
  }

  return iniString
}
