import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Chart } from './charts'

@Entity()
export class Chart_Config {
  @PrimaryGeneratedColumn()
    id!: number

  @OneToOne(() => Chart, (c) => c.config)
    Chart!: Chart

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
}
