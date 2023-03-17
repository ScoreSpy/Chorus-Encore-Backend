import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Chart, Difficulty, Instrument } from './charts'

@Entity()
export class Chart_Hash {
  @PrimaryGeneratedColumn()
    id!: number

  @ManyToOne(() => Chart, (c) => c.hashes)
    Chart!: Chart

  @Column()
    instrument!: Instrument

  @Column()
    difficulty!: Difficulty

  @Column()
    hash!: string
}
