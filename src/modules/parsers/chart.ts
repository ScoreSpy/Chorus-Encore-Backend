// Ported and updated from https://github.com/Paturages/chorus/blob/master/src/utils/meta/chart.js with permission from Paturages

import Iconv from 'iconv-lite'
import { createMD5 } from './../helpers'
import logger from './../log'

const log = logger.createContext('parser/chart')

// To avoid people overwriting useful metadata
const fieldBlacklist = {
  link: true,
  source: true,
  lastModified: true
}

const diffMap = {
  '[ExpertSingle]': 'guitar.x',
  '[HardSingle]': 'guitar.h',
  '[MediumSingle]': 'guitar.m',
  '[EasySingle]': 'guitar.e',

  '[ExpertDoubleBass]': 'bass.x',
  '[HardDoubleBass]': 'bass.h',
  '[MediumDoubleBass]': 'bass.m',
  '[EasyDoubleBass]': 'bass.e',

  '[ExpertDoubleRhythm]': 'rhythm.x',
  '[HardDoubleRhythm]': 'rhythm.h',
  '[MediumDoubleRhythm]': 'rhythm.m',
  '[EasyDoubleRhythm]': 'rhythm.e',

  '[ExpertKeyboard]': 'keys.x',
  '[HardKeyboard]': 'keys.h',
  '[MediumKeyboard]': 'keys.m',
  '[EasyKeyboard]': 'keys.e',

  '[ExpertDrums]': 'drums.x',
  '[HardDrums]': 'drums.h',
  '[MediumDrums]': 'drums.m',
  '[EasyDrums]': 'drums.e',

  '[ExpertGHLGuitar]': 'guitarghl.x',
  '[HardGHLGuitar]': 'guitarghl.h',
  '[MediumGHLGuitar]': 'guitarghl.m',
  '[EasyGHLGuitar]': 'guitarghl.e',

  '[ExpertGHLBass]': 'bassghl.x',
  '[HardGHLBass]': 'bassghl.h',
  '[MediumGHLBass]': 'bassghl.m',
  '[EasyGHLBass]': 'bassghl.e'
}

/*
 * For normalizing the note numbers for the hashes,
 * goes from 1 to 5 for regular frets,
 * 6 for the 6th fret of GHL
 * and 7 for open notes
 */
const notesMap = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 8: 6, 7: 7 }

export type ChorusDiffMapString = {
  x: string;
  h: string;
  m: string;
  e: string;
}

export type ChorusDiffMapNumber = {
  x: number;
  h: number;
  m: number;
  e: number;
}

export type ChorusDiffMapBoolean = {
  x: boolean;
  h: boolean;
  m: boolean;
  e: boolean;
}

export type ChorusChartMeta = {
  Name?: string;
  Artist?: string;
  Charter?: string;
  Year?: string;
  Offset?: string;
  Resolution: number;
  Player2?: string;
  Difficulty?: string;
  PreviewStart?: string;
  PreviewEnd?: string;
  Genre?: string;
  MediaType?: string;
  MusicStream?: string;
  length: number;
  effectiveLength: number;
  Album?: string;
  GuitarStream?: string;
  ArtistText?: string;
  CountOff?: string;
  GuitarVol?: string;
  BandVol?: string;
  HoPo?: string;
  OriginalArtist?: string;
}

export type ChorusChart = {
  hasSections: boolean;
  hasStarPower: boolean;
  hasForced: boolean;
  hasTap: boolean;
  hasOpen: {
    guitar?: ChorusDiffMapBoolean;
    bass?: ChorusDiffMapBoolean;
    rhythm?: ChorusDiffMapBoolean;
    keys?: ChorusDiffMapBoolean;
    drums?: ChorusDiffMapBoolean;
    guitarghl?: ChorusDiffMapBoolean;
    bassghl?: ChorusDiffMapBoolean;
  }

  hasSoloSections: boolean;
  hasLyrics: boolean;
  noteCounts: {
    guitar?: ChorusDiffMapNumber;
    bass?: ChorusDiffMapNumber;
    rhythm?: ChorusDiffMapNumber;
    keys?: ChorusDiffMapNumber;
    drums?: ChorusDiffMapNumber;
    guitarghl?: ChorusDiffMapNumber;
    bassghl?: ChorusDiffMapNumber;
  }

  hashes: {
    file: string;
    guitar?: ChorusDiffMapString;
    bass?: ChorusDiffMapString;
    rhythm?: ChorusDiffMapString;
    keys?: ChorusDiffMapString;
    drums?: ChorusDiffMapString;
    guitarghl?: ChorusDiffMapString;
    bassghl?: ChorusDiffMapString;
  }

  chartMeta: ChorusChartMeta

  is120: boolean;
  hasBrokenNotes: boolean;
  brokenNotes: {
    found?: boolean,
    index: number;
    section: {
      index: number;
      section: string;
    }
    time?: number;
  }[];
}


function parse (chart: Buffer): ChorusChart | null {
  const chartBuffer = chart
  let chartString: string = null

  const sections = []

  const chartData: ChorusChart = {
    chartMeta: {
      Resolution: -1,
      length: -1,
      effectiveLength: -1
    },
    hasStarPower: false,
    hasForced: false,
    hasTap: false,
    hasOpen: {},
    hasSoloSections: false,
    hasLyrics: false,
    hasSections: false,
    brokenNotes: [],
    noteCounts: {},
    hashes: {
      file: createMD5(chartBuffer)
    },
    is120: false,
    hasBrokenNotes: false
  }

  const utf8 = Iconv.decode(chartBuffer, 'utf8')
  if (utf8.indexOf('\u0000') >= 0) {
    chartString = Iconv.decode(chart, 'utf16')
  } else if (utf8.indexOf('�') >= 0) {
    chartString = Iconv.decode(chart, 'latin1')
  } else {
    chartString = utf8
  }

  // Trim each line because of Windows \r\n shenanigans
  const lines = chartString.split('\n').map((line) => line.trim())

  // Get song metadata from the [Song] section as a backup to the song.ini
  const songIndex = lines.find((line) => line.match(/\[Song\]/u))

  // Catch invalid files
  if (!songIndex) {
    return chartData
  }

  for (let i = 1; lines[i] !== null && lines[i] !== '}'; i++) {
    let [param, value] = lines[i].split(' = ')
    if (!value || !value.trim() || fieldBlacklist[param.trim()]) { continue }
    param = param.trim()
    value = value.trim()
    if (value[0] === '"') { value = value.slice(1, -1) }

    // For some reason, there's an extra ", " in front of the year
    if (param === 'Year') { value = value.replace(', ', '') }
    chartData.chartMeta[param] = value
  }

  // Detect sections and lyrics
  const eventsIndex = lines.indexOf('[Events]')
  for (let i = eventsIndex; lines[i] !== null && lines[i] !== '}'; i++) {
    if (!lines[i]) { continue }

    const [index, value] = lines[i].split(' = ')
    if (!value) { continue }

    if (value.match(/"lyric /u)) {
      chartData.hasLyrics = true
    } else if (value.match(/"section /u)) {
      chartData.hasSections = true
      sections.push({
        index: Number(index.trim()),
        section: value
      })
    }
  }

  // Detect features
  const notesIndex = lines.findIndex((line) => diffMap[line.trim()])
  if (!notesIndex || notesIndex < 0) { return chartData }
  let firstNoteIndex = 0
  let lastNoteIndex = 0
  let previous: { index: string, note: string } = null
  let currentStatus: string = null
  const notes = {}

  for (let i = notesIndex; i < lines.length; i++) {
    const line = lines[i]
    if (line.match(/N 5 /u)) {
      chartData.hasForced = true
    } else if (line.match(/N 6 /u)) {
      chartData.hasTap = true
    } else if (line.match(/N 7 /u) && currentStatus) { // Just flag open notes for the whole instrument
      chartData.hasOpen[currentStatus.slice(0, currentStatus.indexOf('.'))] = true
    } else if (line.match(/ solo/u)) {
      chartData.hasSoloSections = true
    } else if (line.match(/S 2/u)) {
      chartData.hasStarPower = true
    }

    // Detect new difficulty
    if (diffMap[line]) {
      currentStatus = diffMap[line]
      notes[currentStatus] = {}
    }

    // Detect new notes
    // eslint-disable-next-line prefer-named-capture-group
    const [, index, note] = line.match(/(\d+) = N ([0-4]|7|8) /u) || []
    if (note && currentStatus) {
      if (!firstNoteIndex) { firstNoteIndex = Number(index) }
      if (Number(index) > lastNoteIndex) { lastNoteIndex = Number(index) }
      notes[currentStatus][index] = `${(notes[currentStatus][index] || '')}${notesMap[note]}`
    }

    /*
     * Detect broken notes (i.e. very small distance between notes)
     * Abysmal @ 64000 and 64768 (1:10'ish) has broken GR chords (distance = 4)
     * Down Here @ 116638 (1:24) has a double orange (distance = 2)
     * I'm in the Band very first note is a doubled yellow (distance = 1)
     * There's likely gonna be some false positives, but this is likely to help setlist makers
     * for proofchecking stuff.
     */
    if (previous) {
      const distance = parseInt(index, 10) - parseInt(previous.index, 10)
      if (distance > 0 && distance < 5) {
        chartData.brokenNotes.push({
          index: Number(previous.index),
          // eslint-disable-next-line no-loop-func
          section: sections[sections.findIndex((section) => Number(section.index) > Number(previous.index)) - 1],
          time: 0
        })
      }
    }

    if (Number(index) && (!previous || previous.index !== index)) { previous = { index, note } }
  }

  // Get Tempo map [SyncTrack] to get effective song length
  const syncTrackIndexStart = lines.indexOf('[SyncTrack]')
  const syncTrackIndexEnd = lines.indexOf('}', syncTrackIndexStart)
  const tempoMap: [number, number][] = lines.slice(syncTrackIndexStart, syncTrackIndexEnd).reduce((arr, line) => {
    // eslint-disable-next-line prefer-named-capture-group
    const [, index, bpm] = line.match(/\s*(\d+) = B (\d+)/u) || []
    if (index) { arr.push([Number(index), Number(bpm) / 1000]) }
    return arr
  }, [])

  let time = 0
  let timeToFirstNote = 0
  let timeToLastNote = 0
  let isFirstNoteFound = false
  let isLastNoteFound = false
  let currentIndex = -1
  let currentBpm = -1
  chartData.chartMeta.Resolution = Number(chartData.chartMeta.Resolution)

  for (let i = 0; i < tempoMap.length; i++) {
    if (!tempoMap[i]) { continue }

    const index = tempoMap[i][0]
    const bpm = tempoMap[i][1]

    if (currentIndex !== -1) {
      /*
       * Does it look like I pulled this formula from my ass? because I kinda did tbh
       * (the "Resolution" parameter defines how many "units" there are in a beat)
       */
      time += (((index - currentIndex) * 60) / (currentBpm * chartData.chartMeta.Resolution))

      // Calculate the timestamp of the first note
      if (index <= firstNoteIndex) {
        timeToFirstNote += (((index - currentIndex) * 60) / (currentBpm * chartData.chartMeta.Resolution))
      } else if (!isFirstNoteFound) {
        isFirstNoteFound = true
        timeToFirstNote += (((firstNoteIndex - currentIndex) * 60) / (currentBpm * chartData.chartMeta.Resolution))
      }

      // Calculate the timestamp of the last note
      if (index <= lastNoteIndex) {
        timeToLastNote += (((index - currentIndex) * 60) / (currentBpm * chartData.chartMeta.Resolution))
      } else if (!isLastNoteFound) {
        isLastNoteFound = true
        timeToLastNote += (((lastNoteIndex - currentIndex) * 60) / (currentBpm * chartData.chartMeta.Resolution))
      }

      // Compute timestamp of broken notes
      // eslint-disable-next-line id-length
      for (let n = 0; n < chartData.brokenNotes.length; n++) {
        const note = chartData.brokenNotes[n]
        if (index <= note.index) {
          note.time += (((index - currentIndex) * 60) / (currentBpm * chartData.chartMeta.Resolution))
        } else if (!note.found) {
          note.found = true
          note.time += (((note.index - currentIndex) * 60) / (currentBpm * chartData.chartMeta.Resolution))
        }
      }
    }

    currentIndex = index
    currentBpm = bpm
  }


  /*
   * If the current index is 0 (beginning of chart) and the BPM is 120 ("B 120000"),
   * it's most likely cancer (not beat mapped) and has to be checked by physicians
   */
  chartData.is120 = currentIndex === 0 && currentBpm === 120

  /*
   * Do it one last time against the last note if the last note is after
   * the last BPM change
   */
  if (currentIndex < lastNoteIndex) {
    time += (((lastNoteIndex - currentIndex) * 60) / (currentBpm * chartData.chartMeta.Resolution))
    timeToLastNote += (((lastNoteIndex - currentIndex) * 60) / (currentBpm * chartData.chartMeta.Resolution))
  }

  chartData.brokenNotes.forEach((note) => {
    delete note.found
  })

  // Compute the hash of the .chart itself first
  for (const part in notes) {
    if (!part) { continue }

    const [instrument, difficulty] = part.split('.')

    // We have to reorder the values by ascending index (Object.values gets by "alphabetical" order of index)
    // eslint-disable-next-line id-length
    const notesArray = Object.keys(notes[part]).sort((a, b) => (Number(a) < Number(b) ? -1 : 1)).map((index) => notes[part][Number(index)])

    // Ignore tracks with less than 10 notes
    if (notesArray.length < 10) { continue }

    if (!chartData.hashes[instrument]) {
      chartData.hashes[instrument] = {}
      chartData.noteCounts[instrument] = {}
    }

    // Compute the hashes and note counts of individual difficulties/instruments
    chartData.noteCounts[instrument][difficulty] = notesArray.length
    chartData.hashes[instrument][difficulty] = createMD5(notesArray.join(' '))
  }

  chartData.chartMeta.length = time >> 0

  // "Effective song length" = time between first and last note
  chartData.chartMeta.effectiveLength = (timeToLastNote - timeToFirstNote) >> 0
  chartData.hasBrokenNotes = Boolean(chartData.brokenNotes.length)

  return chartData
}

export default function parseChart (midiFile: Buffer): ChorusChart | null {
  try {
    return parse(midiFile)
  } catch (err) {
    log.error(err)
    return null
  }
}
