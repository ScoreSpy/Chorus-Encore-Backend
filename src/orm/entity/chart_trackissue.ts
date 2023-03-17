import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Chart, Difficulty, Instrument, TrackIssueType } from './charts'

@Entity()
export class Chart_TrackIssue {
  @PrimaryGeneratedColumn()
    id!: number

  @ManyToOne(() => Chart, (c) => c.trackIssues)
    Chart!: Chart

  @Column()
    trackIssues!: TrackIssueType

  @Column()
    instrument!: Instrument

  @Column()
    difficulty!: Difficulty
}
