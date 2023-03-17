import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Chart } from './charts'

@Entity()
export class Chart_Files {
  @PrimaryGeneratedColumn()
    id!: number

  @OneToOne(() => Chart, (c) => c.files)
    Chart!: Chart

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
}
