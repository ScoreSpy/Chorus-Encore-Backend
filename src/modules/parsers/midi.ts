// Ported and updated from https://github.com/Paturages/chorus/blob/master/src/utils/meta/midi.js with permission from Paturages

import { createMD5 } from './../helpers'
import logger from './../log'
import MIDIFile from 'midifile'
import type { ChorusDiffMapBoolean, ChorusDiffMapNumber, ChorusDiffMapString } from './../../types'

const log = logger.createContext('parser/midi')

const partMap = {
  'PART GUITAR': 'guitar',
  'PART BASS': 'bass',
  'PART RHYTHM': 'rhythm',
  'PART KEYS': 'keys',
  'PART DRUMS': 'drums',
  'PART VOCALS': 'vocals',
  'PART GUITAR GHL': 'guitarghl',
  'PART BASS GHL': 'bassghl'
}
// eslint-disable-next-line id-length
const diffOffsets = { e: 59, m: 71, h: 83, x: 95 }

export type ChorusMidi = {
  hasSections: boolean
  hasStarPower: boolean
  hasForced: boolean
  hasSoloSections: boolean
  hasTap: boolean
  hasOpen: {
    guitar?: ChorusDiffMapBoolean;
    bass?: ChorusDiffMapBoolean;
    rhythm?: ChorusDiffMapBoolean;
    keys?: ChorusDiffMapBoolean;
    drums?: ChorusDiffMapBoolean;
    guitarghl?: ChorusDiffMapBoolean;
    bassghl?: ChorusDiffMapBoolean;
  }
  noteCounts: {
    guitar?: ChorusDiffMapNumber;
    bass?: ChorusDiffMapNumber;
    rhythm?: ChorusDiffMapNumber;
    keys?: ChorusDiffMapNumber;
    drums?: ChorusDiffMapNumber;
    guitarghl?: ChorusDiffMapNumber;
    bassghl?: ChorusDiffMapNumber;
  }
  is120: boolean
  hasLyrics: boolean
  hashes: {
    file: string,
    guitar?: ChorusDiffMapString;
    bass?: ChorusDiffMapString;
    rhythm?: ChorusDiffMapString;
    keys?: ChorusDiffMapString;
    drums?: ChorusDiffMapString;
    guitarghl?: ChorusDiffMapString;
    bassghl?: ChorusDiffMapString;
  }
  hasBrokenNotes: boolean
  brokenNotes: {
    time: number
    nextTime?: number
  }[]
  chartMeta: {
    length: number
    effectiveLength: number
  }
}

function parse (midiFile: Buffer): ChorusMidi | null {
  const midi = new MIDIFile(Buffer.from(midiFile))
  let isOpen = false
  let firstNoteTime = -1
  let lastNoteTime = 0
  let previous: { time: number } = null
  const tracks = {}
  const notes = {}

  const chartData: ChorusMidi = {
    hasSections: false,
    hasStarPower: false,
    hasForced: false,
    hasSoloSections: false,
    hasTap: false,
    hasOpen: { },
    noteCounts: { },
    is120: false,
    hasLyrics: false,
    hashes: {
      file: createMD5(Buffer.from(midiFile))
    },
    hasBrokenNotes: false,
    brokenNotes: [],
    chartMeta: {
      length: -1,
      effectiveLength: -1
    }
  }

  // Detect 120 BPM charts because fuck that shit seriously
  const bpmEvents = midi.getTrackEvents(0).filter(({ tempoBPM }) => tempoBPM)
  chartData.is120 = bpmEvents.length === 1 && bpmEvents[0].tempoBPM === 120

  midi.getEvents().forEach((event) => {
    /*
     * Data is a string attached to the MIDI event.
     * It generally denotes chart events (sections, lighting...)
     */
    const data = event.data ? event.data.map((dta) => String.fromCharCode(dta)).join('') : null

    // Let's hope I'm not wrong
    if (event.param1 === 103) {
      chartData.hasSoloSections = true
    // eslint-disable-next-line prefer-named-capture-group
    } else if (data && data.match(/^\[(section|prc)/u)) { // Prc? different standards for .mids smh, that's most likely from RB though
      chartData.hasSections = true
    } else if (data && partMap[data]) {
      if (data.trim() === 'PART VOCALS') { // CH lyrics take from the vocals part
        chartData.hasLyrics = true
      }
      tracks[event.track] = partMap[data]
    } else if (data === 'PS\u0000\u0000ÿ\u0004\u0001÷') { // If that ain't black magic, I don't know what it is. But it works.
      chartData.hasTap = true
    } else if (data === 'PS\u0000\u0000\u0003\u0001\u0001÷') {
      chartData.hasOpen[tracks[event.track]] = true
      isOpen = true
    } else if (data === 'PS\u0000\u0000\u0003\u0001\u0000÷') { isOpen = false }

    /*
     * Param1 is the note being played.
     * The interesting things happen here...
     */
    if (event.param1 && event.param1 !== 103) {
      if (event.param1 === 116) {
        chartData.hasStarPower = true
      } else if ([65, 66, 77, 78, 89, 90, 101, 102].indexOf(event.param1) > -1) {
        chartData.hasForced = true
      } else if (tracks[event.track] !== 'guitarghl' && tracks[event.track] !== 'bassghl') {
        // Detect which difficulty the note is on
        let diff: string = null
        if (event.param1 >= 60 && event.param1 <= 64) {
          diff = 'e'
        } else if (event.param1 >= 72 && event.param1 <= 76) {
          diff = 'm'
        } else if (event.param1 >= 84 && event.param1 <= 88) {
          diff = 'h'
        } else if (event.param1 >= 96 && event.param1 <= 100) {
          diff = 'x'
        }

        /*
         * Event.subtype == 9 is the note being on,
         * event.subtype == 8 is the note being off... I think?
         */
        if (diff && event.subtype === 9) {
          /*
           * Broken note logic
           * Check chart.js for the logic behind broken notes,
           * I can't be bothered to copy/paste/adapt
           */
          if (previous) {
            const distance = event.playTime - previous.time
            if (distance > 0 && distance < 5) {
              chartData.brokenNotes.push({ time: previous.time, nextTime: event.playTime })
            }
          }
          if (!previous || previous.time !== event.playTime) { previous = { time: event.playTime } }
          if (!firstNoteTime) { firstNoteTime = event.playTime }
          if (event.playTime > lastNoteTime) { lastNoteTime = event.playTime }
          if (!notes[`${tracks[event.track]}.${diff}`]) { notes[`${tracks[event.track]}.${diff}`] = {} }
          notes[`${tracks[event.track]}.${diff}`][event.playTime] = `${notes[`${tracks[event.track]}.${diff}`][event.playTime] || ''}${isOpen ? 7 : event.param1 - diffOffsets[diff]}`
        }
      } else {
        // Detect which difficulty the note is on
        let diff: string = null
        if (event.param1 >= 94) {
          diff = 'x'
        } else if (event.param1 >= 82) {
          diff = 'h'
        } else if (event.param1 >= 70) {
          diff = 'm'
        } else if (event.param1) {
          diff = 'e'
        }

        if (diff && event.subtype === 9) {
          if (previous) {
            const distance = event.playTime - previous.time
            if (distance > 0 && distance < 5) {
              chartData.brokenNotes.push({ time: previous.time })
            }
          }

          if (!previous || previous.time !== event.playTime) { previous = { time: event.playTime } }
          if (!firstNoteTime) { firstNoteTime = event.playTime }
          if (event.playTime > lastNoteTime) { lastNoteTime = event.playTime }
          if (!notes[`${tracks[event.track]}.${diff}`]) { notes[`${tracks[event.track]}.${diff}`] = {} }

          // GHL notes are offset by 2. If the ensuing result equals 0, it's an open note.
          notes[`${tracks[event.track]}.${diff}`][event.playTime] = `${notes[`${tracks[event.track]}.${diff}`][event.playTime] || ''}${Number(event.param1 - diffOffsets[diff] + 1) || 7}`
        }
      }
    }
  })

  // Compute the hash of the .mid itself first
  let earliestNote = Number(Infinity)
  let latestNote = 0

  // eslint-disable-next-line guard-for-in
  for (const part in notes) {
    const [instrument, difficulty] = part.split('.')

    // We have to reorder the values by ascending index (Object.values gets by "alphabetical" order of index)
    // eslint-disable-next-line no-loop-func, id-length
    const notesArray = Object.keys(notes[part]).sort((a, b) => (Number(a) < Number(b) ? -1 : 1)).map((index) => {
      const indexNumber = Number(index)
      if (indexNumber < earliestNote) { earliestNote = indexNumber }
      if (indexNumber > latestNote) { latestNote = indexNumber }
      return notes[part][indexNumber]
    })

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

  chartData.hasBrokenNotes = Boolean(chartData.brokenNotes.length)
  chartData.chartMeta.length = lastNoteTime / 1000 >> 0
  chartData.chartMeta.effectiveLength = (lastNoteTime - firstNoteTime) / 1000 >> 0

  return chartData
}

export default function parseMidi (midiFile: Buffer) {
  try {
    return parse(midiFile)
  } catch (err) {
    log.error(err)
    return null
  }
}
