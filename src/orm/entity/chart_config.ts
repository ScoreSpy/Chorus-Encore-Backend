import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Chart } from './charts'

@Entity()
export class Chart_Config {
  @PrimaryGeneratedColumn()
    id!: number

  @OneToOne(() => Chart, (c) => c.config)
    Chart!: Chart

  @Column({ type: 'int', nullable: true })
    album_track!: number | null

  @Column({ type: 'text', nullable: true })
    album?: string

  @Column({ type: 'text', nullable: true })
    artist?: string

  @Column({ type: 'text', nullable: true })
    charter?: string

  @Column({ type: 'int', nullable: true })
    diff_band!: number | null

  @Column({ type: 'int', nullable: true })
    diff_bass!: number | null

  @Column({ type: 'int', nullable: true })
    diff_bassghl!: number | null

  @Column({ type: 'int', nullable: true })
    diff_drums_real!: number | null

  @Column({ type: 'int', nullable: true })
    diff_drums!: number | null

  @Column({ type: 'int', nullable: true })
    diff_guitar_coop!: number | null

  @Column({ type: 'int', nullable: true })
    diff_guitar!: number | null

  @Column({ type: 'int', nullable: true })
    diff_guitarghl!: number | null

  @Column({ type: 'int', nullable: true })
    diff_keys!: number | null

  @Column({ type: 'int', nullable: true })
    diff_rhythm!: number | null

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
    preview_start_time!: number | null

  @Column({ type: 'int', default: 0 })
    pro_drums!: boolean

  @Column({ type: 'int', nullable: true })
    playlist_track!: number | null

  @Column({ type: 'int', nullable: true })
    song_length!: number | null

  @Column({ type: 'int', nullable: true })
    track!: number | null

  @Column({ type: 'int', nullable: true })
    video_start_time!: number | null

  @Column({ type: 'int', nullable: true })
    year!: number | null
}
