import { FastifyInstance, FastifyServerOptions } from 'fastify'

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
              required: ['hasSections', 'hasStarPower', 'hasForced', 'hasSoloSections', 'hasTap', 'hasLyrics', 'is120', 'hasBrokenNotes', 'hasOpen', 'noteCounts', 'hashes', 'chartMeta'],
              properties: {
                hasSections: { type: 'boolean' },
                hasStarPower: { type: 'boolean' },
                hasForced: { type: 'boolean' },
                hasSoloSections: { type: 'boolean' },
                hasTap: { type: 'boolean' },
                hasLyrics: { type: 'boolean' },
                is120: { type: 'boolean' },
                hasBrokenNotes: { type: 'boolean' },
                hasOpen: {
                  type: 'object',
                  required: [],
                  properties: {
                    guitar: { type: 'boolean' },
                    bass: { type: 'boolean' },
                    rhythm: { type: 'boolean' },
                    keys: { type: 'boolean' },
                    drums: { type: 'boolean' },
                    guitarghl: { type: 'boolean' },
                    bassghl: { type: 'boolean' }
                  }
                },
                noteCounts: {
                  type: 'object',
                  required: [],
                  properties: {
                    guitar: {
                      type: 'object',
                      required: ['e', 'm', 'h', 'x'],
                      properties: { e: { type: 'number' }, m: { type: 'number' }, h: { type: 'number' }, x: { type: 'number' } }
                    },
                    bass: {
                      type: 'object',
                      required: ['e', 'm', 'h', 'x'],
                      properties: { e: { type: 'number' }, m: { type: 'number' }, h: { type: 'number' }, x: { type: 'number' } }
                    },
                    rhythm: {
                      type: 'object',
                      required: ['e', 'm', 'h', 'x'],
                      properties: { e: { type: 'number' }, m: { type: 'number' }, h: { type: 'number' }, x: { type: 'number' } }
                    },
                    keys: {
                      type: 'object',
                      required: ['e', 'm', 'h', 'x'],
                      properties: { e: { type: 'number' }, m: { type: 'number' }, h: { type: 'number' }, x: { type: 'number' } }
                    },
                    drums: {
                      type: 'object',
                      required: ['e', 'm', 'h', 'x'],
                      properties: { e: { type: 'number' }, m: { type: 'number' }, h: { type: 'number' }, x: { type: 'number' } }
                    },
                    guitarghl: {
                      type: 'object',
                      required: ['e', 'm', 'h', 'x'],
                      properties: { e: { type: 'number' }, m: { type: 'number' }, h: { type: 'number' }, x: { type: 'number' } }
                    },
                    bassghl: {
                      type: 'object',
                      required: ['e', 'm', 'h', 'x'],
                      properties: { e: { type: 'number' }, m: { type: 'number' }, h: { type: 'number' }, x: { type: 'number' } }
                    }
                  }
                },
                hashes: {
                  type: 'object',
                  required: ['file'],
                  properties: {
                    file: { type: 'string' },
                    guitar: {
                      type: 'object',
                      required: ['e', 'm', 'h', 'x'],
                      properties: { e: { type: 'string' }, m: { type: 'string' }, h: { type: 'string' }, x: { type: 'string' } }
                    },
                    bass: {
                      type: 'object',
                      required: ['e', 'm', 'h', 'x'],
                      properties: { e: { type: 'string' }, m: { type: 'string' }, h: { type: 'string' }, x: { type: 'string' } }
                    },
                    rhythm: {
                      type: 'object',
                      required: ['e', 'm', 'h', 'x'],
                      properties: { e: { type: 'string' }, m: { type: 'string' }, h: { type: 'string' }, x: { type: 'string' } }
                    },
                    keys: {
                      type: 'object',
                      required: ['e', 'm', 'h', 'x'],
                      properties: { e: { type: 'string' }, m: { type: 'string' }, h: { type: 'string' }, x: { type: 'string' } }
                    },
                    drums: {
                      type: 'object',
                      required: ['e', 'm', 'h', 'x'],
                      properties: { e: { type: 'string' }, m: { type: 'string' }, h: { type: 'string' }, x: { type: 'string' } }
                    },
                    guitarghl: {
                      type: 'object',
                      required: ['e', 'm', 'h', 'x'],
                      properties: { e: { type: 'string' }, m: { type: 'string' }, h: { type: 'string' }, x: { type: 'string' } }
                    },
                    bassghl: {
                      type: 'object',
                      required: ['e', 'm', 'h', 'x'],
                      properties: { e: { type: 'string' }, m: { type: 'string' }, h: { type: 'string' }, x: { type: 'string' } }
                    }
                  }
                },
                chartMeta: {
                  type: 'object',
                  required: [],
                  properties: {
                    length: { type: 'number' },
                    effectiveLength: { type: 'number' }
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
    hasSections: boolean
    hasStarPower: boolean
    hasForced: boolean
    hasSoloSections: boolean
    hasTap: boolean
    hasLyrics: boolean
    is120: boolean
    hasBrokenNotes: boolean
    hasOpen: {
      guitar?: boolean
      bass?: boolean
      rhythm?: boolean
      keys?: boolean
      drums?: boolean
      guitarghl?: boolean
      bassghl?: boolean
    }
    noteCounts: {
      guitar?: ChorusDiffMapNumber
      bass?: ChorusDiffMapNumber
      rhythm?: ChorusDiffMapNumber
      keys?: ChorusDiffMapNumber
      drums?: ChorusDiffMapNumber
      guitarghl?: ChorusDiffMapNumber
      bassghl?: ChorusDiffMapNumber
    }
    hashes: {
      file: string,
      guitar?: ChorusDiffMapString
      bass?: ChorusDiffMapString
      rhythm?: ChorusDiffMapString
      keys?: ChorusDiffMapString
      drums?: ChorusDiffMapString
      guitarghl?: ChorusDiffMapString
      bassghl?: ChorusDiffMapString
    }
    chartMeta: {
      length: number,
      effectiveLength: number
    }
  },
  files: {
    video: {
      highway: boolean,
      video: boolean
    },
    image: {
      album: boolean,
      background: boolean,
      highway: boolean
    },
    stems: {
      guitar: boolean,
      bass: boolean,
      rhythm: boolean,
      vocals: boolean,
      vocals_1: boolean,
      vocals_2: boolean,
      drums: boolean,
      drums_1: boolean,
      drums_2: boolean,
      drums_3: boolean,
      drums_4: boolean,
      keys: boolean,
      song: boolean,
      crowd: boolean
    },
    chart: {
      mid: boolean,
      chart: boolean,
    },
    config: {
      ini: boolean,
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
