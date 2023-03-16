import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
@Index(['checksum', 'drive_id', 'file_id'], { unique: true })
export class archives {
  @PrimaryGeneratedColumn()
    id!: number

  @Column({ type: 'varchar', length: 50 })
    checksum!: string

  @Column({ type: 'varchar', length: 50 })
    drive_id!: string

  @Column({ type: 'varchar', length: 50 })
    file_id!: string

  @Column({ type: 'varchar', length: 255 })
    name!: string

  @Column({ type: 'datetime' })
    google_created!: Date

  @CreateDateColumn({ type: 'datetime' })
    created!: Date

  @UpdateDateColumn({ type: 'datetime' })
    updated!: Date
}
