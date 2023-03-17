import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { ChartIssueType, Difficulty, Instrument, NoteIssueType, TrackIssueType } from '../../../../orm/entity/charts'

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
    console.log(req.body)
    console.log('owo')
    return res.send({ response: `Ingested ${req.body.songs.length} songs` })
  })

  next()
}
