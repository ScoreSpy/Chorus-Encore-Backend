import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class system_logs {
  @PrimaryGeneratedColumn()
    id!: number

  @Column('bigint', { nullable: true })
    author!: string | null

  @Column('longtext')
    log!: string

  @Column('longtext', { nullable: true })
    stack!: string | null

  @Column({ type: 'int' })
    type!: number

  @Column({ type: 'text' })
    module!: string

  @CreateDateColumn({ type: 'datetime' })
    time!: Date
}
