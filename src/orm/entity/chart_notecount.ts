import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Chart, Difficulty, Instrument } from './charts'

@Entity()
export class Chart_NoteCount {
  @PrimaryGeneratedColumn()
    id!: number

  @ManyToOne(() => Chart, (c) => c.noteCounts)
    Chart!: Chart

  @Column()
    count!: number

  @Column()
    instrument!: Instrument

  @Column()
    difficulty!: Difficulty
}
