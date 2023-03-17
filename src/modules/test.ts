import { Chart } from '../orm/entity/charts'
import { Chart_Hash } from '../orm/entity/chart_hash'
import { Chart_MaxNps } from '../orm/entity/chart_maxnps'
import { Chart_NoteCount } from '../orm/entity/chart_notecount'
import { Chart_NoteIssue } from '../orm/entity/chart_noteissue'
import { Chart_TrackIssue } from '../orm/entity/chart_trackissue'
import database from './database'

export enum Instrument {
  Guitar = 1 << 0,
  Rhythm = 1 << 1,
  Bass = 1 << 2,
  Drums = 1 << 3,
  Keys = 1 << 4,
  GuitarGHL = 1 << 5,
  BassGHL = 1 << 6,
}

export enum Difficulty {
  Expert = 1 << 0,
  Hard = 1 << 1,
  Medium = 1 << 2,
  Easy = 1 << 3,
}

export enum NoteIssueType {
  FiveNoteChord = 1 << 0,
  DifficultyForbiddenNote = 1 << 1,
  ThreeNoteDrumChord = 1 << 2,
  BrokenNote = 1 << 3,
  BadSustainGap = 1 << 4,
  BabySustain = 1 << 5,
}

export enum TrackIssueType {
  NoStarPower = 1 << 0,
  NoDrumActivationLanes = 1 << 1,
}

export enum ChartIssueType {
  UnparseableSectionsOrBadEncoding = 1 << 0,
  NoResolution = 1 << 1,
  NoSyncTrackSection = 1 << 2,
  NoNotes = 1 << 3,
  NoExpert = 1 << 4,
  IsDefaultBPM = 1 << 5,
  MisalignedTimeSignatures = 1 << 6,
  NoSections = 1 << 7,
  SmallLeadingSilence = 1 << 8,
}

export async function test () {
  // create some random notesData
  const entry = new Chart()
  entry.instruments = Instrument.Guitar | Instrument.Drums
  entry.hasSoloSections = true
  entry.hasLyrics = false
  entry.hasForcedNotes = true
  entry.hasTapNotes = false
  entry.hasOpenNotes = false
  entry.has2xKick = true
  entry.chartIssues = ChartIssueType.NoNotes
  entry.tempoMapHash = 'tempomaphash'
  entry.tempoMarkerCount = 4
  entry.length = 200
  entry.effectiveLength = 180

  console.log(entry)
  console.log(entry.noteIssues)

  // Chart_NoteIssue
  const noteIssues1 = new Chart_NoteIssue()
  noteIssues1.issueType = NoteIssueType.BadSustainGap
  noteIssues1.tick = 100
  noteIssues1.time = 10.0

  const noteIssues2 = new Chart_NoteIssue()
  noteIssues2.issueType = NoteIssueType.ThreeNoteDrumChord
  noteIssues2.tick = 200
  noteIssues2.time = 20.0

  entry.noteIssues = [noteIssues1, noteIssues2]

  // Chart_TrackIssue
  const trackIssues1 = new Chart_TrackIssue()
  trackIssues1.instrument = Instrument.Guitar
  trackIssues1.difficulty = Difficulty.Hard
  trackIssues1.trackIssues = TrackIssueType.NoStarPower

  const trackIssues2 = new Chart_TrackIssue()
  trackIssues2.instrument = Instrument.Drums
  trackIssues2.difficulty = Difficulty.Hard
  trackIssues2.trackIssues = TrackIssueType.NoDrumActivationLanes

  entry.trackIssues = [trackIssues1, trackIssues2]

  // Chart_NoteCount
  const noteCounts1 = new Chart_NoteCount()
  noteCounts1.instrument = Instrument.Guitar
  noteCounts1.difficulty = Difficulty.Medium
  noteCounts1.count = 100

  const noteCounts2 = new Chart_NoteCount()
  noteCounts2.instrument = Instrument.Drums
  noteCounts2.difficulty = Difficulty.Medium
  noteCounts2.count = 100

  entry.noteCounts = [noteCounts1, noteCounts2]

  // Chart_MaxNps
  const maxNps1 = new Chart_MaxNps()
  maxNps1.instrument = Instrument.Guitar
  maxNps1.difficulty = Difficulty.Expert
  maxNps1.tick = 500
  maxNps1.time = 50.0
  maxNps1.nps = 10

  const maxNps2 = new Chart_MaxNps()
  maxNps2.instrument = Instrument.Drums
  maxNps2.difficulty = Difficulty.Expert
  maxNps2.tick = 600
  maxNps2.time = 60.0
  maxNps2.nps = 12

  entry.maxNps = [maxNps1, maxNps2]

  // Chart_Hash
  const hashes1 = new Chart_Hash()
  hashes1.instrument = Instrument.Guitar
  hashes1.difficulty = Difficulty.Expert
  hashes1.hash = 'randomhash1'

  const hashes2 = new Chart_Hash()
  hashes2.instrument = Instrument.Drums
  hashes2.difficulty = Difficulty.Expert
  hashes2.hash = 'randomhash2'

  entry.hashes = [hashes1, hashes2]


  // save the Chart object
  const savedChart = await database.chart.save(entry)
  console.log(savedChart)

  // console.log(JSON.stringify(await notesDataRepository.find(), null, 4))
}
