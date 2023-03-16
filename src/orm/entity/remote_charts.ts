import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class remote_charts {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ type: 'varchar', length: 50 })
    checksum!: string

  @Column({ type: 'varchar', length: 50 })
    drive_id!: string

  @Column({ type: 'varchar', length: 50 })
    file_id!: string

  @CreateDateColumn({ type: 'datetime' })
    time!: Date
}
