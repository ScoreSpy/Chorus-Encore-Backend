/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'


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

@Entity()
export class Chart {
  @PrimaryGeneratedColumn()
    id!: number

  @Column()
    instruments!: Instrument

  @Column()
    hasSoloSections!: boolean

  @Column()
    hasLyrics!: boolean

  @Column()
    hasForcedNotes!: boolean

  @Column()
    hasTapNotes!: boolean

  @Column()
    hasOpenNotes!: boolean

  @Column()
    has2xKick!: boolean

  @Column()
    tempoMapHash!: string

  @Column()
    tempoMarkerCount!: number

  @Column()
    length!: number

  @Column()
    effectiveLength!: number

  @Column()
    chartIssues!: number

  // relations
  @OneToMany(() => Chart_NoteIssue, (noteIssue) => noteIssue.Chart, { cascade: true })
    noteIssues!: Chart_NoteIssue[]

  @OneToMany(() => Chart_TrackIssue, (trackIssue) => trackIssue.Chart, { cascade: true })
    trackIssues!: Chart_TrackIssue[]

  @OneToMany(() => Chart_NoteCount, (noteCount) => noteCount.Chart, { cascade: true })
    noteCounts!: Chart_NoteCount[]

  @OneToMany(() => Chart_MaxNps, (maxNps) => maxNps.Chart, { cascade: true })
    maxNps!: Chart_MaxNps[]

  @OneToMany(() => Chart_Hash, (hash) => hash.Chart, { cascade: true })
    hashes!: Chart_Hash[]

  @OneToOne(() => Chart_Files, (files) => files.Chart)
  @JoinColumn()
    files!: Chart_Files

  @OneToOne(() => Chart_Config, (config) => config.Chart)
  @JoinColumn()
    config!: Chart_Config
}

@Entity()
export class Chart_NoteIssue {
  @PrimaryGeneratedColumn()
    id!: number

  @Column()
    issueType!: NoteIssueType

  @Column()
    tick!: number

  @Column()
    time!: number

  @ManyToOne(() => Chart, (c) => c.noteIssues)
    Chart!: Chart
}

@Entity()
export class Chart_TrackIssue {
  @PrimaryGeneratedColumn()
    id!: number

  @Column()
    trackIssues!: TrackIssueType

  @ManyToOne(() => Chart, (c) => c.trackIssues)
    Chart!: Chart

  @Column()
    instrument!: Instrument

  @Column()
    difficulty!: Difficulty
}

@Entity()
export class Chart_NoteCount {
  @PrimaryGeneratedColumn()
    id!: number

  @Column()
    count!: number

  @ManyToOne(() => Chart, (c) => c.noteCounts)
    Chart!: Chart

  @Column()
    instrument!: Instrument

  @Column()
    difficulty!: Difficulty
}

@Entity()
export class Chart_MaxNps {
  @PrimaryGeneratedColumn()
    id!: number

  @Column()
    tick!: number

  @Column()
    time!: number

  @Column()
    nps!: number

  @ManyToOne(() => Chart, (c) => c.maxNps)
    Chart!: Chart

  @Column()
    instrument!: Instrument

  @Column()
    difficulty!: Difficulty
}

@Entity()
export class Chart_Hash {
  @PrimaryGeneratedColumn()
    id!: number

  @Column()
    hash!: string

  @ManyToOne(() => Chart, (c) => c.hashes)
    Chart!: Chart

  @Column()
    instrument!: Instrument

  @Column()
    difficulty!: Difficulty
}

@Entity()
export class Chart_Config {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ type: 'int', nullable: true })
    album_track?: number

  @Column({ type: 'text', nullable: true })
    album?: string

  @Column({ type: 'text', nullable: true })
    artist?: string

  @Column({ type: 'text', nullable: true })
    charter?: string

  @Column({ type: 'int', nullable: true })
    diff_band?: number

  @Column({ type: 'int', nullable: true })
    diff_bass?: number

  @Column({ type: 'int', nullable: true })
    diff_bassghl?: number

  @Column({ type: 'int', nullable: true })
    diff_drums_real?: number

  @Column({ type: 'int', nullable: true })
    diff_drums?: number

  @Column({ type: 'int', nullable: true })
    diff_guitar_coop?: number

  @Column({ type: 'int', nullable: true })
    diff_guitar?: number

  @Column({ type: 'int', nullable: true })
    diff_guitarghl?: number

  @Column({ type: 'int', nullable: true })
    diff_keys?: number

  @Column({ type: 'int', nullable: true })
    diff_rhythm?: number

  @Column({ type: 'int', default: 0 })
    five_lane_drums!: boolean

  @Column({ type: 'text', nullable: true })
    genre?: string

  @Column({ type: 'text', nullable: true })
    icon?: string

  @Column({ type: 'text', nullable: true })
    loading_phrase?: string

  @Column({ type: 'int', default: 0 })
    modchart!: boolean

  @Column({ type: 'text', nullable: true })
    name?: string

  @Column({ type: 'int', nullable: true })
    preview_start_time?: number

  @Column({ type: 'int', default: 0 })
    pro_drums!: boolean

  @Column({ type: 'int', nullable: true })
    playlist_track?: number

  @Column({ type: 'int', nullable: true })
    song_length?: number

  @Column({ type: 'int', nullable: true })
    track?: number

  @Column({ type: 'int', nullable: true })
    video_start_time?: number

  @Column({ type: 'int', nullable: true })
    year?: number

  @OneToOne(() => Chart, (c) => c.config)
    Chart!: Chart
}


@Entity()
export class Chart_Files {
  @PrimaryGeneratedColumn()
    id!: number

  // videos
  @Column({ type: 'int', default: 0 })
    video_highway!: boolean

  @Column({ type: 'int', default: 0 })
    video_video!: boolean

  // images
  @Column({ type: 'int', default: 0 })
    image_album!: boolean

  @Column({ type: 'int', default: 0 })
    image_background!: boolean

  @Column({ type: 'int', default: 0 })
    image_highway!: boolean

  // stems
  @Column({ type: 'int', default: 0 })
    stems_guitar!: boolean

  @Column({ type: 'int', default: 0 })
    stems_bass!: boolean

  @Column({ type: 'int', default: 0 })
    stems_rhythm!: boolean

  @Column({ type: 'int', default: 0 })
    stems_vocals!: boolean

  @Column({ type: 'int', default: 0 })
    stems_vocals_1!: boolean

  @Column({ type: 'int', default: 0 })
    stems_vocals_2!: boolean

  @Column({ type: 'int', default: 0 })
    stems_drums!: boolean

  @Column({ type: 'int', default: 0 })
    stems_drums_1!: boolean

  @Column({ type: 'int', default: 0 })
    stems_drums_2!: boolean

  @Column({ type: 'int', default: 0 })
    stems_drums_3!: boolean

  @Column({ type: 'int', default: 0 })
    stems_drums_4!: boolean

  @Column({ type: 'int', default: 0 })
    stems_keys!: boolean

  @Column({ type: 'int', default: 0 })
    stems_song!: boolean

  @Column({ type: 'int', default: 0 })
    stems_crowd!: boolean

  // chart
  @Column({ type: 'int', default: 0 })
    chart_mid!: boolean

  @Column({ type: 'int', default: 0 })
    chart_chart!: boolean

  // config
  @Column({ type: 'int', default: 0 })
    config_ini!: boolean

  @OneToOne(() => Chart, (c) => c.files)
    Chart!: Chart
}
