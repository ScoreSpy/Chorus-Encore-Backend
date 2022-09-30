import { ChartFormat, DifficultyFlags } from './../types'
import { charts } from './../orm/entity/charts'
import { ChorusMapBooleanToDifficultyFlags, ChorusMapStringToDifficultyFlags, GetInstrumentFlagsFromChart, GetInstrumentFlagsFromChartByDiff, parseIntOrNull } from './helpers'
import type { ChorusChart } from './parsers/chart'
import type { ChorusIni } from './parsers/ini'
import type { ChorusMidi } from './parsers/midi'

function combineData (data: charts, chartData: ChorusChart | ChorusMidi): charts {
  // CHART DATA
  data.chart_hasSections = chartData.hasSections
  data.chart_hasStarPower = chartData.hasStarPower
  data.chart_hasForced = chartData.hasForced
  data.chart_hasSoloSections = chartData.hasSoloSections
  data.chart_hasTap = chartData.hasTap
  data.chart_is120 = chartData.is120
  data.chart_hasLyrics = chartData.hasLyrics
  data.chart_hasBrokenNotes = chartData.hasBrokenNotes
  data.chart_length = chartData.chartMeta.length
  data.chart_effective_length = chartData.chartMeta.effectiveLength

  data.chart_hasOpen_guitar = ChorusMapBooleanToDifficultyFlags(chartData.hasOpen.guitar)
  data.chart_hasOpen_bass = ChorusMapBooleanToDifficultyFlags(chartData.hasOpen.bass)
  data.chart_hasOpen_rhythm = ChorusMapBooleanToDifficultyFlags(chartData.hasOpen.rhythm)
  data.chart_hasOpen_keys = ChorusMapBooleanToDifficultyFlags(chartData.hasOpen.keys)
  data.chart_hasOpen_drums = ChorusMapBooleanToDifficultyFlags(chartData.hasOpen.drums)
  data.chart_hasOpen_guitarghl = ChorusMapBooleanToDifficultyFlags(chartData.hasOpen.guitarghl)
  data.chart_hasOpen_bassghl = ChorusMapBooleanToDifficultyFlags(chartData.hasOpen.bassghl)

  // NOTE COUNT
  data.chart_noteCounts_guitar_e = chartData.noteCounts.guitar && chartData.noteCounts.guitar.e
  data.chart_noteCounts_guitar_m = chartData.noteCounts.guitar && chartData.noteCounts.guitar.m
  data.chart_noteCounts_guitar_h = chartData.noteCounts.guitar && chartData.noteCounts.guitar.h
  data.chart_noteCounts_guitar_x = chartData.noteCounts.guitar && chartData.noteCounts.guitar.x

  data.chart_noteCounts_bass_e = chartData.noteCounts.bass && chartData.noteCounts.bass.e
  data.chart_noteCounts_bass_m = chartData.noteCounts.bass && chartData.noteCounts.bass.m
  data.chart_noteCounts_bass_h = chartData.noteCounts.bass && chartData.noteCounts.bass.h
  data.chart_noteCounts_bass_x = chartData.noteCounts.bass && chartData.noteCounts.bass.x

  data.chart_noteCounts_rhythm_e = chartData.noteCounts.rhythm && chartData.noteCounts.rhythm.e
  data.chart_noteCounts_rhythm_m = chartData.noteCounts.rhythm && chartData.noteCounts.rhythm.m
  data.chart_noteCounts_rhythm_h = chartData.noteCounts.rhythm && chartData.noteCounts.rhythm.h
  data.chart_noteCounts_rhythm_x = chartData.noteCounts.rhythm && chartData.noteCounts.rhythm.x

  data.chart_noteCounts_keys_e = chartData.noteCounts.keys && chartData.noteCounts.keys.e
  data.chart_noteCounts_keys_m = chartData.noteCounts.keys && chartData.noteCounts.keys.m
  data.chart_noteCounts_keys_h = chartData.noteCounts.keys && chartData.noteCounts.keys.h
  data.chart_noteCounts_keys_x = chartData.noteCounts.keys && chartData.noteCounts.keys.x

  data.chart_noteCounts_drums_e = chartData.noteCounts.drums && chartData.noteCounts.drums.e
  data.chart_noteCounts_drums_m = chartData.noteCounts.drums && chartData.noteCounts.drums.m
  data.chart_noteCounts_drums_h = chartData.noteCounts.drums && chartData.noteCounts.drums.h
  data.chart_noteCounts_drums_x = chartData.noteCounts.drums && chartData.noteCounts.drums.x

  data.chart_noteCounts_guitarghl_e = chartData.noteCounts.guitarghl && chartData.noteCounts.guitarghl.e
  data.chart_noteCounts_guitarghl_m = chartData.noteCounts.guitarghl && chartData.noteCounts.guitarghl.m
  data.chart_noteCounts_guitarghl_h = chartData.noteCounts.guitarghl && chartData.noteCounts.guitarghl.h
  data.chart_noteCounts_guitarghl_x = chartData.noteCounts.guitarghl && chartData.noteCounts.guitarghl.x

  data.chart_noteCounts_bassghl_e = chartData.noteCounts.bassghl && chartData.noteCounts.bassghl.e
  data.chart_noteCounts_bassghl_m = chartData.noteCounts.bassghl && chartData.noteCounts.bassghl.m
  data.chart_noteCounts_bassghl_h = chartData.noteCounts.bassghl && chartData.noteCounts.bassghl.h
  data.chart_noteCounts_bassghl_x = chartData.noteCounts.bassghl && chartData.noteCounts.bassghl.x

  // HASHES
  data.checksum = chartData.hashes.file

  data.chart_hashes_guitar_e = chartData.hashes.guitar && chartData.hashes.guitar.e
  data.chart_hashes_guitar_m = chartData.hashes.guitar && chartData.hashes.guitar.m
  data.chart_hashes_guitar_h = chartData.hashes.guitar && chartData.hashes.guitar.h
  data.chart_hashes_guitar_x = chartData.hashes.guitar && chartData.hashes.guitar.x

  data.chart_hashes_bass_e = chartData.hashes.bass && chartData.hashes.bass.e
  data.chart_hashes_bass_m = chartData.hashes.bass && chartData.hashes.bass.m
  data.chart_hashes_bass_h = chartData.hashes.bass && chartData.hashes.bass.h
  data.chart_hashes_bass_x = chartData.hashes.bass && chartData.hashes.bass.x

  data.chart_hashes_rhythm_e = chartData.hashes.rhythm && chartData.hashes.rhythm.e
  data.chart_hashes_rhythm_m = chartData.hashes.rhythm && chartData.hashes.rhythm.m
  data.chart_hashes_rhythm_h = chartData.hashes.rhythm && chartData.hashes.rhythm.h
  data.chart_hashes_rhythm_x = chartData.hashes.rhythm && chartData.hashes.rhythm.x

  data.chart_hashes_keys_e = chartData.hashes.keys && chartData.hashes.keys.e
  data.chart_hashes_keys_m = chartData.hashes.keys && chartData.hashes.keys.m
  data.chart_hashes_keys_h = chartData.hashes.keys && chartData.hashes.keys.h
  data.chart_hashes_keys_x = chartData.hashes.keys && chartData.hashes.keys.x

  data.chart_hashes_drums_e = chartData.hashes.drums && chartData.hashes.drums.e
  data.chart_hashes_drums_m = chartData.hashes.drums && chartData.hashes.drums.m
  data.chart_hashes_drums_h = chartData.hashes.drums && chartData.hashes.drums.h
  data.chart_hashes_drums_x = chartData.hashes.drums && chartData.hashes.drums.x

  data.chart_hashes_guitarghl_e = chartData.hashes.guitarghl && chartData.hashes.guitarghl.e
  data.chart_hashes_guitarghl_m = chartData.hashes.guitarghl && chartData.hashes.guitarghl.m
  data.chart_hashes_guitarghl_h = chartData.hashes.guitarghl && chartData.hashes.guitarghl.h
  data.chart_hashes_guitarghl_x = chartData.hashes.guitarghl && chartData.hashes.guitarghl.x

  data.chart_hashes_bassghl_e = chartData.hashes.bassghl && chartData.hashes.bassghl.e
  data.chart_hashes_bassghl_m = chartData.hashes.bassghl && chartData.hashes.bassghl.m
  data.chart_hashes_bassghl_h = chartData.hashes.bassghl && chartData.hashes.bassghl.h
  data.chart_hashes_bassghl_x = chartData.hashes.bassghl && chartData.hashes.bassghl.x

  // ADDITIONAL DATA
  data.chart_difficultys_guitar = ChorusMapStringToDifficultyFlags(chartData.hashes.guitar)
  data.chart_difficultys_bass = ChorusMapStringToDifficultyFlags(chartData.hashes.guitar)
  data.chart_difficultys_rhythm = ChorusMapStringToDifficultyFlags(chartData.hashes.guitar)
  data.chart_difficultys_keys = ChorusMapStringToDifficultyFlags(chartData.hashes.guitar)
  data.chart_difficultys_drums = ChorusMapStringToDifficultyFlags(chartData.hashes.guitar)
  data.chart_difficultys_guitarghl = ChorusMapStringToDifficultyFlags(chartData.hashes.guitar)
  data.chart_difficultys_bassghl = ChorusMapStringToDifficultyFlags(chartData.hashes.guitar)

  data.chart_instruments = GetInstrumentFlagsFromChart(data)
  data.chart_instruments_e = GetInstrumentFlagsFromChartByDiff(data, DifficultyFlags.Easy)
  data.chart_instruments_m = GetInstrumentFlagsFromChartByDiff(data, DifficultyFlags.Medium)
  data.chart_instruments_h = GetInstrumentFlagsFromChartByDiff(data, DifficultyFlags.Hard)
  data.chart_instruments_x = GetInstrumentFlagsFromChartByDiff(data, DifficultyFlags.Expert)

  return data
}


export function combineChartData (iniData: ChorusIni, chartData: ChorusChart): charts {
  const data = new charts()

  data.chart_format = ChartFormat.CHART

  // INI DATA
  data.ini_album_track = parseIntOrNull(iniData.album_track)
  data.ini_album = iniData.album || chartData.chartMeta.Album
  data.ini_artist = iniData.artist || chartData.chartMeta.Artist
  data.ini_charter = iniData.charter || iniData.frets || chartData.chartMeta.Charter
  data.ini_diff_band = parseIntOrNull(iniData.diff_band)
  data.ini_diff_bass = parseIntOrNull(iniData.diff_bass)
  data.ini_diff_bassghl = parseIntOrNull(iniData.diff_bassghl)
  data.ini_diff_drums = parseIntOrNull(iniData.diff_drums)
  data.ini_diff_guitar = parseIntOrNull(iniData.diff_guitar)
  data.ini_diff_guitarghl = parseIntOrNull(iniData.diff_guitarghl)
  data.ini_diff_keys = parseIntOrNull(iniData.diff_keys)
  data.ini_diff_rhythm = parseIntOrNull(iniData.diff_rhythm)
  data.ini_genre = iniData.genre || chartData.chartMeta.Genre
  data.ini_icon = iniData.icon
  data.ini_loading_phrase = iniData.loading_phrase
  data.ini_name = iniData.name || chartData.chartMeta.Name
  data.ini_playlist_track = parseIntOrNull(iniData.playlist_track)
  data.ini_song_length = parseIntOrNull(iniData.song_length)
  data.ini_track = parseIntOrNull(iniData.track)
  data.ini_year = iniData.year || iniData.year

  return combineData(data, chartData)
}

export function combineMidiData (iniData: ChorusIni, chartData: ChorusMidi): charts {
  const data = new charts()

  data.chart_format = ChartFormat.CHART

  // INI DATA
  data.ini_album_track = parseIntOrNull(iniData.album_track)
  data.ini_album = iniData.album
  data.ini_artist = iniData.artist
  data.ini_charter = iniData.charter || iniData.frets
  data.ini_diff_band = parseIntOrNull(iniData.diff_band)
  data.ini_diff_bass = parseIntOrNull(iniData.diff_bass)
  data.ini_diff_bassghl = parseIntOrNull(iniData.diff_bassghl)
  data.ini_diff_drums = parseIntOrNull(iniData.diff_drums)
  data.ini_diff_guitar = parseIntOrNull(iniData.diff_guitar)
  data.ini_diff_guitarghl = parseIntOrNull(iniData.diff_guitarghl)
  data.ini_diff_keys = parseIntOrNull(iniData.diff_keys)
  data.ini_diff_rhythm = parseIntOrNull(iniData.diff_rhythm)
  data.ini_genre = iniData.genre
  data.ini_icon = iniData.icon
  data.ini_loading_phrase = iniData.loading_phrase
  data.ini_name = iniData.name
  data.ini_playlist_track = parseIntOrNull(iniData.playlist_track)
  data.ini_song_length = parseIntOrNull(iniData.song_length)
  data.ini_track = parseIntOrNull(iniData.track)
  data.ini_year = iniData.year || iniData.year

  return combineData(data, chartData)
}
