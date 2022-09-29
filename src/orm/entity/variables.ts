import { Column, Entity } from 'typeorm'

@Entity()
export class variables {
  @Column({ type: 'varchar', length: 50, unique: true, primary: true })
    key: string

  @Column({ type: 'int' })
    value: boolean
}
