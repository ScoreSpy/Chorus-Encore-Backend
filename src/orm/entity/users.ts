import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export enum UserLevel {
  user = 1 << 0,
  mod = 1 << 1,
  admin = 1 << 2
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
    id!: number

  @Index('_index_snowflake')
  @Column('bigint', { unique: true })
    snowflake!: string

  @Column({ type: 'varchar', length: 38 })
    display_name!: string

  @Column()
    user_level!: UserLevel

  @Column({ type: 'varchar', length: 50 })
    drive_id!: string

  @Column({ type: 'varchar', length: 50, unique: true })
    api!: string

  @CreateDateColumn({ type: 'datetime' })
    created!: Date

  @UpdateDateColumn({ type: 'datetime' })
    updated!: Date
}
