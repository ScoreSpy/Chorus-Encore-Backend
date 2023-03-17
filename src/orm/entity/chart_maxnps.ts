import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Chart, Difficulty, Instrument } from './charts'

@Entity()
export class Chart_MaxNps {
  @PrimaryGeneratedColumn()
    id!: number

  @ManyToOne(() => Chart, (c) => c.maxNps)
    Chart!: Chart

  @Column()
    instrument!: Instrument

  @Column()
    difficulty!: Difficulty

  @Column()
    tick!: number

  @Column()
    time!: number

  @Column()
    nps!: number
}
