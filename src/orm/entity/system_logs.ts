import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class system_logs {
  @PrimaryGeneratedColumn()
    id: number

  @Column('bigint', { nullable: true })
    author: string

  @Column('longtext')
    log: string

  @Column('longtext', { nullable: true })
    stack: string

  @Column()
    type: number

  @Column()
    module: string

  @CreateDateColumn({ type: 'datetime' })
    time: Date
}
