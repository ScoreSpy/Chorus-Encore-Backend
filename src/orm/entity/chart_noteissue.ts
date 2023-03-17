import { Chart, Difficulty, NoteIssueType } from './charts'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Instrument } from '../../modules/test'

@Entity()
export class Chart_NoteIssue {
  @PrimaryGeneratedColumn()
    id!: number

  @ManyToOne(() => Chart, (c) => c.noteIssues)
    Chart!: Chart

  @Column()
    instrument!: Instrument

  @Column()
    difficulty!: Difficulty

  @Column()
    issueType!: NoteIssueType

  @Column()
    tick!: number

  @Column()
    time!: number
}
