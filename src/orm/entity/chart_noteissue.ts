import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Chart, NoteIssueType } from './charts'

@Entity()
export class Chart_NoteIssue {
  @PrimaryGeneratedColumn()
    id!: number

  @ManyToOne(() => Chart, (c) => c.noteIssues)
    Chart!: Chart

  @Column()
    issueType!: NoteIssueType

  @Column()
    tick!: number

  @Column()
    time!: number
}
