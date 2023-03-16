import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

export enum ChartFormat {
  MIDI = 1 << 0,
  CHART = 1 << 1
}

export enum InstrumentFlags {
  None = 0,
  Guitar = 1 << 0,
  bass = 1 << 1,
  rhythm = 1 << 2,
  keys = 1 << 3,
  drums = 1 << 4,
  guitarghl = 1 << 5,
  bassghl = 1 << 6
}

export enum DifficultyFlags {
  None = 0,
  Easy = 1 << 0,
  Medium = 1 << 1,
  Hard = 1 << 2,
  Expert = 1 << 3
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

export type ChorusDiffMapBoolean = {
  x: boolean;
  h: boolean;
  m: boolean;
  e: boolean;
}

@Entity()
export class charts {
  @PrimaryGeneratedColumn()
    id!: number

  @CreateDateColumn({ type: 'timestamp' })
    created!: Date

  @Index('_index_snowflake')
  @Column('bigint', { unique: true })
    snowflake!: string

  @Column({ type: 'int' })
    chart_format!: ChartFormat

  @Column({ type: 'int' })
    has_video!: boolean

  // INI DATA
  @Column({ type: 'int', nullable: true })
    ini_album_track?: number

  @Column({ type: 'text', nullable: true })
    ini_album?: string

  @Column({ type: 'text', nullable: true })
    ini_artist?: string

  @Column({ type: 'text', nullable: true })
    ini_charter?: string

  @Column({ type: 'int', nullable: true })
    ini_diff_band?: number

  @Column({ type: 'int', nullable: true })
    ini_diff_bass?: number

  @Column({ type: 'int', nullable: true })
    ini_diff_bassghl?: number

  @Column({ type: 'int', nullable: true })
    ini_diff_drums_real?: number

  @Column({ type: 'int', nullable: true })
    ini_diff_drums?: number

  @Column({ type: 'int', nullable: true })
    ini_diff_guitar_coop?: number

  @Column({ type: 'int', nullable: true })
    ini_diff_guitar?: number

  @Column({ type: 'int', nullable: true })
    ini_diff_guitarghl?: number

  @Column({ type: 'int', nullable: true })
    ini_diff_keys?: number

  @Column({ type: 'int', nullable: true })
    ini_diff_rhythm?: number

  @Column({ type: 'int', default: 0 })
    ini_five_lane_drums?: boolean

  @Column({ type: 'text', nullable: true })
    ini_genre?: string

  @Column({ type: 'text', nullable: true })
    ini_icon?: string

  @Column({ type: 'text', nullable: true })
    ini_loading_phrase?: string

  @Column({ type: 'int', default: 0 })
    ini_modchart?: boolean

  @Column({ type: 'text', nullable: true })
    ini_name?: string

  @Column({ type: 'int', nullable: true })
    ini_preview_start_time?: number

  @Column({ type: 'int', default: 0 })
    ini_pro_drums?: boolean

  @Column({ type: 'int', nullable: true })
    ini_playlist_track?: number

  @Column({ type: 'int', nullable: true })
    ini_song_length?: number

  @Column({ type: 'int', nullable: true })
    ini_track?: number

  @Column({ type: 'int', nullable: true })
    ini_video_start_time?: number

  @Column({ type: 'int', nullable: true })
    ini_year?: number

  // CHART DATA
  @Column({ type: 'int' })
    chart_hasSections!: boolean

  @Column({ type: 'int' })
    chart_hasStarPower!: boolean

  @Column({ type: 'int' })
    chart_hasForced!: boolean

  @Column({ type: 'int' })
    chart_hasSoloSections!: boolean

  @Column({ type: 'int' })
    chart_hasTap!: boolean

  @Column({ type: 'int' })
    chart_is120!: boolean

  @Column({ type: 'int' })
    chart_hasLyrics!: boolean

  @Column({ type: 'int' })
    chart_hasBrokenNotes!: boolean

  @Column({ type: 'int' })
    chart_length!: number

  @Column({ type: 'int' })
    chart_effective_length!: number

  @Column({ type: 'int', nullable: true })
    chart_hasOpen_guitar?: boolean
  @Column({ type: 'int', nullable: true })
    chart_hasOpen_bass?: boolean
  @Column({ type: 'int', nullable: true })
    chart_hasOpen_rhythm?: boolean
  @Column({ type: 'int', nullable: true })
    chart_hasOpen_keys?: boolean
  @Column({ type: 'int', nullable: true })
    chart_hasOpen_drums?: boolean
  @Column({ type: 'int', nullable: true })
    chart_hasOpen_guitarghl?: boolean
  @Column({ type: 'int', nullable: true })
    chart_hasOpen_bassghl?: boolean

  // NOTE COUNT
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_guitar_e?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_guitar_m?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_guitar_h?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_guitar_x?: number

  @Column({ type: 'int', nullable: true })
    chart_noteCounts_bass_e?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_bass_m?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_bass_h?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_bass_x?: number

  @Column({ type: 'int', nullable: true })
    chart_noteCounts_rhythm_e?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_rhythm_m?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_rhythm_h?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_rhythm_x?: number

  @Column({ type: 'int', nullable: true })
    chart_noteCounts_keys_e?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_keys_m?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_keys_h?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_keys_x?: number

  @Column({ type: 'int', nullable: true })
    chart_noteCounts_drums_e?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_drums_m?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_drums_h?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_drums_x?: number

  @Column({ type: 'int', nullable: true })
    chart_noteCounts_guitarghl_e?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_guitarghl_m?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_guitarghl_h?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_guitarghl_x?: number

  @Column({ type: 'int', nullable: true })
    chart_noteCounts_bassghl_e?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_bassghl_m?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_bassghl_h?: number
  @Column({ type: 'int', nullable: true })
    chart_noteCounts_bassghl_x?: number

  // HASHES
  @Index('_index_checksum')
  @Column({ type: 'varchar', length: 50 })
    checksum!: string

  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_guitar_e?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_guitar_m?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_guitar_h?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_guitar_x?: string

  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_bass_e?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_bass_m?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_bass_h?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_bass_x?: string

  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_rhythm_e?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_rhythm_m?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_rhythm_h?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_rhythm_x?: string

  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_keys_e?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_keys_m?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_keys_h?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_keys_x?: string

  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_drums_e?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_drums_m?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_drums_h?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_drums_x?: string

  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_guitarghl_e?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_guitarghl_m?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_guitarghl_h?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_guitarghl_x?: string

  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_bassghl_e?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_bassghl_m?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_bassghl_h?: string
  @Column({ type: 'varchar', length: 50, nullable: true })
    chart_hashes_bassghl_x?: string

  // ADDITIONAL DATA
  @Column({ type: 'int' })
    chart_difficultys_guitar!: DifficultyFlags
  @Column({ type: 'int' })
    chart_difficultys_bass!: DifficultyFlags
  @Column({ type: 'int' })
    chart_difficultys_rhythm!: DifficultyFlags
  @Column({ type: 'int' })
    chart_difficultys_keys!: DifficultyFlags
  @Column({ type: 'int' })
    chart_difficultys_drums!: DifficultyFlags
  @Column({ type: 'int' })
    chart_difficultys_guitarghl!: DifficultyFlags
  @Column({ type: 'int' })
    chart_difficultys_bassghl!: DifficultyFlags

  @Column({ type: 'int' })
    chart_instruments!: InstrumentFlags
  @Column({ type: 'int' })
    chart_instruments_e!: InstrumentFlags
  @Column({ type: 'int' })
    chart_instruments_m!: InstrumentFlags
  @Column({ type: 'int' })
    chart_instruments_h!: InstrumentFlags
  @Column({ type: 'int' })
    chart_instruments_x!: InstrumentFlags
}
