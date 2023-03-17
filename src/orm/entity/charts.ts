/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'


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

  @OneToMany(() => Chart_NoteIssue, (noteIssue) => noteIssue.Chart, { cascade: true })
    noteIssues!: Chart_NoteIssue[]

  @OneToMany(() => Chart_TrackIssue, (trackIssue) => trackIssue.Chart, { cascade: true })
    trackIssues!: Chart_TrackIssue[]

  @Column()
    chartIssues!: number

  @OneToMany(() => Chart_NoteCount, (noteCount) => noteCount.Chart, { cascade: true })
    noteCounts!: Chart_NoteCount[]

  @OneToMany(() => Chart_MaxNps, (maxNps) => maxNps.Chart, { cascade: true })
    maxNps!: Chart_MaxNps[]

  @OneToMany(() => Chart_Hash, (hash) => hash.Chart, { cascade: true })
    hashes!: Chart_Hash[]

  @Column()
    tempoMapHash!: string

  @Column()
    tempoMarkerCount!: number

  @Column()
    length!: number

  @Column()
    effectiveLength!: number
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
