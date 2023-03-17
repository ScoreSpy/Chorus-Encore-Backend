import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { StringToBooleanOrNull, StringToNumberOrNull } from '../../../../modules/converters'
import database from '../../../../modules/database'
import { Chart, ChartIssueType, Difficulty, Instrument, NoteIssueType, TrackIssueType } from '../../../../orm/entity/charts'
import { Chart_Config } from '../../../../orm/entity/chart_config'
import { Chart_Files } from '../../../../orm/entity/chart_files'
import { Chart_Hash } from '../../../../orm/entity/chart_hash'
import { Chart_MaxNps } from '../../../../orm/entity/chart_maxnps'
import { Chart_NoteCount } from '../../../../orm/entity/chart_notecount'
import { Chart_NoteIssue } from '../../../../orm/entity/chart_noteissue'
import { Chart_TrackIssue } from '../../../../orm/entity/chart_trackissue'

const route = '/ingestSongs'
const schema = {
  summary: '',
  description: '',
  tags: ['Public'],
  body: {
    type: 'object',
    required: ['songs'],
    properties: {
      songs: {
        type: 'array',
        items: {
          type: 'object',
          required: ['iniData', 'chartData', 'files'],
          properties: {
            iniData: {
              type: 'object',
              required: [],
              properties: {
                album_track: { type: 'string' },
                album: { type: 'string' },
                artist: { type: 'string' },
                charter: { type: 'string' },
                delay: { type: 'string' },
                diff_band: { type: 'string' },
                diff_bass: { type: 'string' },
                diff_bassghl: { type: 'string' },
                diff_drums_real: { type: 'string' },
                diff_drums: { type: 'string' },
                diff_guitar_coop: { type: 'string' },
                diff_guitar: { type: 'string' },
                diff_guitarghl: { type: 'string' },
                diff_keys: { type: 'string' },
                diff_rhythm: { type: 'string' },
                end_events: { type: 'string' },
                five_lane_drums: { type: 'string' },
                frets: { type: 'string' },
                genre: { type: 'string' },
                hopo_frequency: { type: 'string' },
                icon: { type: 'string' },
                loading_phrase: { type: 'string' },
                modchart: { type: 'string' },
                multiplier_note: { type: 'string' },
                name: { type: 'string' },
                playlist_track: { type: 'string' },
                preview_start_time: { type: 'string' },
                pro_drums: { type: 'string' },
                song_length: { type: 'string' },
                sustain_cutoff_threshold: { type: 'string' },
                track: { type: 'string' },
                video_start_time: { type: 'string' },
                year: { type: 'string' }
              }
            },
            chartData: {
              type: 'object',
              required: ['instruments', 'hasSoloSections', 'hasLyrics', 'hasForcedNotes', 'hasTapNotes', 'hasOpenNotes', 'has2xKick', 'chartIssues', 'tempoMapHash', 'tempoMarkerCount', 'length', 'effectiveLength', 'noteissues', 'trackIssues', 'noteCounts', 'maxNps', 'hashes'],
              properties: {
                instruments: { type: 'number' },
                hasSoloSections: { type: 'boolean' },
                hasLyrics: { type: 'boolean' },
                hasForcedNotes: { type: 'boolean' },
                hasTapNotes: { type: 'boolean' },
                hasOpenNotes: { type: 'boolean' },
                has2xKick: { type: 'boolean' },
                chartIssues: { type: 'number' },
                tempoMapHash: { type: 'string' },
                tempoMarkerCount: { type: 'number' },
                length: { type: 'number' },
                effectiveLength: { type: 'number' },
                noteissues: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: [],
                    properties: {
                      instrument: { type: 'number' },
                      difficulty: { type: 'number' },
                      issueType: { type: 'number' },
                      tick: { type: 'number' },
                      time: { type: 'number' }
                    }
                  }
                },
                trackIssues: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: [],
                    properties: {
                      instrument: { type: 'number' },
                      difficulty: { type: 'number' },
                      trackIssues: { type: 'number' }
                    }
                  }
                },
                noteCounts: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: [],
                    properties: {
                      instrument: { type: 'number' },
                      difficulty: { type: 'number' },
                      count: { type: 'number' }
                    }
                  }
                },
                maxNps: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: [],
                    properties: {
                      instrument: { type: 'number' },
                      difficulty: { type: 'number' },
                      tick: { type: 'number' },
                      time: { type: 'number' },
                      nps: { type: 'number' }
                    }
                  }
                },
                hashes: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: [],
                    properties: {
                      instrument: { type: 'number' },
                      difficulty: { type: 'number' },
                      hash: { type: 'string' }
                    }
                  }
                }
              }
            },
            checksums: {
              type: 'object',
              required: ['chart', 'archive'],
              properties: {
                archive: { type: 'string' },
                chart: {
                  type: 'object',
                  properties: {
                    mid: { type: 'string' },
                    chart: { type: 'string' }
                  }
                }
              }
            },
            files: {
              type: 'object',
              required: ['video', 'image', 'stems', 'chart', 'config'],
              properties: {
                video: {
                  type: 'object',
                  required: ['highway', 'video'],
                  properties: {
                    highway: { type: 'boolean' },
                    video: { type: 'boolean' }
                  }
                },
                image: {
                  type: 'object',
                  required: ['album', 'background', 'highway'],
                  properties: {
                    album: { type: 'boolean' },
                    background: { type: 'boolean' },
                    highway: { type: 'boolean' }
                  }
                },
                stems: {
                  type: 'object',
                  required: ['guitar', 'bass', 'rhythm', 'vocals', 'vocals_1', 'vocals_2', 'drums', 'drums_1', 'drums_2', 'drums_3', 'drums_4', 'keys', 'song', 'crowd'],
                  properties: {
                    guitar: { type: 'boolean' },
                    bass: { type: 'boolean' },
                    rhythm: { type: 'boolean' },
                    vocals: { type: 'boolean' },
                    vocals_1: { type: 'boolean' },
                    vocals_2: { type: 'boolean' },
                    drums: { type: 'boolean' },
                    drums_1: { type: 'boolean' },
                    drums_2: { type: 'boolean' },
                    drums_3: { type: 'boolean' },
                    drums_4: { type: 'boolean' },
                    keys: { type: 'boolean' },
                    song: { type: 'boolean' },
                    crowd: { type: 'boolean' }
                  }
                },
                chart: {
                  type: 'object',
                  required: ['mid', 'chart'],
                  properties: {
                    mid: { type: 'boolean' },
                    chart: { type: 'boolean' }
                  }
                },
                config: {
                  type: 'object',
                  required: ['ini'],
                  properties: {
                    ini: { type: 'boolean' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

export type SongData = {
  iniData: {
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
  },
  chartData: {
    instruments: Instrument
    hasSoloSections: boolean
    hasLyrics: boolean
    hasForcedNotes: boolean
    hasTapNotes: boolean
    hasOpenNotes: boolean
    has2xKick: boolean
    chartIssues: ChartIssueType
    tempoMapHash: string
    tempoMarkerCount: number
    length: number
    effectiveLength: number
    noteissues: {
      instrument: Instrument
      difficulty: Difficulty
      issueType: NoteIssueType
      tick: number
      time: number
    }[],
    trackIssues: {
      instrument: Instrument
      difficulty: Difficulty
      trackIssues: TrackIssueType
    }[],
    noteCounts: {
      instrument: Instrument
      difficulty: Difficulty
      count: number
    }[],
    maxNps: {
      instrument: Instrument
      difficulty: Difficulty
      tick: number
      time: number
      nps: number
    }[],
    hashes: {
      instrument: Instrument
      difficulty: Difficulty
      hash: string
    }[]
  },
  checksums: {
    chart: {
      mid: string | null
      chart: string | null
    },
    archive: string
  },
  files: {
    video: {
      highway: boolean
      video: boolean
    },
    image: {
      album: boolean
      background: boolean
      highway: boolean
    },
    stems: {
      guitar: boolean
      bass: boolean
      rhythm: boolean
      vocals: boolean
      vocals_1: boolean
      vocals_2: boolean
      drums: boolean
      drums_1: boolean
      drums_2: boolean
      drums_3: boolean
      drums_4: boolean
      keys: boolean
      song: boolean
      crowd: boolean
    },
    chart: {
      mid: boolean
      chart: boolean
    },
    config: {
      ini: boolean
    }
  }
}

export default function POST_ingestSongs (server: FastifyInstance, options: FastifyServerOptions, next: CallableFunction) {
  // eslint-disable-next-line require-await
  server.post<{ Body: { songs: SongData[] } }>(route, { preHandler: [], schema }, async (req, res) => {
    for (const chart of req.body.songs) {
      const entry = new Chart()
      entry.instruments = chart.chartData.instruments
      entry.hasSoloSections = chart.chartData.hasSoloSections
      entry.hasLyrics = chart.chartData.hasLyrics
      entry.hasForcedNotes = chart.chartData.hasForcedNotes
      entry.hasTapNotes = chart.chartData.hasTapNotes
      entry.hasOpenNotes = chart.chartData.hasOpenNotes
      entry.has2xKick = chart.chartData.has2xKick
      entry.chartIssues = chart.chartData.chartIssues
      entry.tempoMapHash = chart.chartData.tempoMapHash
      entry.tempoMarkerCount = chart.chartData.tempoMarkerCount
      entry.length = chart.chartData.length
      entry.effectiveLength = chart.chartData.effectiveLength

      entry.noteIssues = []
      for (const data of chart.chartData.noteissues) {
        const query = new Chart_NoteIssue()
        query.instrument = data.instrument
        query.difficulty = data.difficulty
        query.issueType = data.issueType
        query.tick = data.tick
        query.time = data.time
        entry.noteIssues.push(query)
      }

      entry.trackIssues = []
      for (const data of chart.chartData.trackIssues) {
        const query = new Chart_TrackIssue()
        query.instrument = data.instrument
        query.difficulty = data.difficulty
        query.trackIssues = data.trackIssues
        entry.trackIssues.push(query)
      }

      entry.noteCounts = []
      for (const data of chart.chartData.noteCounts) {
        const query = new Chart_NoteCount()
        query.instrument = data.instrument
        query.difficulty = data.difficulty
        query.count = data.count
        entry.noteCounts.push(query)
      }

      entry.maxNps = []
      for (const data of chart.chartData.maxNps) {
        const query = new Chart_MaxNps()
        query.instrument = data.instrument
        query.difficulty = data.difficulty
        query.tick = data.tick
        query.time = data.time
        query.nps = data.nps
        entry.maxNps.push(query)
      }

      entry.hashes = []
      for (const data of chart.chartData.hashes) {
        const query = new Chart_Hash()
        query.instrument = data.instrument
        query.difficulty = data.difficulty
        query.hash = data.hash
        entry.hashes.push(query)
      }

      const files = new Chart_Files()
      files.chart_chart = chart.files.chart.chart
      files.chart_mid = chart.files.chart.mid
      files.config_ini = chart.files.config.ini
      files.image_album = chart.files.image.album
      files.image_background = chart.files.image.background
      files.image_highway = chart.files.image.highway
      files.stems_bass = chart.files.stems.bass
      files.stems_crowd = chart.files.stems.crowd
      files.stems_drums = chart.files.stems.drums
      files.stems_drums_1 = chart.files.stems.drums_1
      files.stems_drums_2 = chart.files.stems.drums_2
      files.stems_drums_3 = chart.files.stems.drums_3
      files.stems_drums_4 = chart.files.stems.drums_4
      files.stems_guitar = chart.files.stems.guitar
      files.stems_keys = chart.files.stems.keys
      files.stems_rhythm = chart.files.stems.rhythm
      files.stems_song = chart.files.stems.song
      files.stems_vocals = chart.files.stems.vocals
      files.stems_vocals_1 = chart.files.stems.vocals_1
      files.stems_vocals_2 = chart.files.stems.vocals_2
      files.video_highway = chart.files.video.highway
      files.video_video = chart.files.video.video
      entry.files = files

      const config = new Chart_Config()
      config.album_track = StringToNumberOrNull(chart.iniData.album_track)
      config.album = chart.iniData.album
      config.artist = chart.iniData.artist
      config.charter = chart.iniData.charter
      config.diff_band = StringToNumberOrNull(chart.iniData.diff_band)
      config.diff_bass = StringToNumberOrNull(chart.iniData.diff_bass)
      config.diff_bassghl = StringToNumberOrNull(chart.iniData.diff_bassghl)
      config.diff_drums_real = StringToNumberOrNull(chart.iniData.diff_drums_real)
      config.diff_drums = StringToNumberOrNull(chart.iniData.diff_drums)
      config.diff_guitar_coop = StringToNumberOrNull(chart.iniData.diff_guitar_coop)
      config.diff_guitar = StringToNumberOrNull(chart.iniData.diff_guitar)
      config.diff_guitarghl = StringToNumberOrNull(chart.iniData.diff_guitarghl)
      config.diff_keys = StringToNumberOrNull(chart.iniData.diff_keys)
      config.diff_rhythm = StringToNumberOrNull(chart.iniData.diff_rhythm)
      config.five_lane_drums = StringToBooleanOrNull(chart.iniData.five_lane_drums) || false
      config.genre = chart.iniData.genre
      config.icon = chart.iniData.icon
      config.loading_phrase = chart.iniData.loading_phrase
      config.modchart = StringToBooleanOrNull(chart.iniData.modchart) || false
      config.name = chart.iniData.name
      config.preview_start_time = StringToNumberOrNull(chart.iniData.preview_start_time)
      config.pro_drums = StringToBooleanOrNull(chart.iniData.pro_drums) || false
      config.playlist_track = StringToNumberOrNull(chart.iniData.playlist_track)
      config.song_length = StringToNumberOrNull(chart.iniData.song_length)
      config.track = StringToNumberOrNull(chart.iniData.track)
      config.video_start_time = StringToNumberOrNull(chart.iniData.video_start_time)
      config.year = StringToNumberOrNull(chart.iniData.year)
      entry.config = config

      // save the Chart object
      await database.chart.save(entry)
    }


    return res.send({ response: `Ingested ${req.body.songs.length} songs` })
  })

  next()
}
