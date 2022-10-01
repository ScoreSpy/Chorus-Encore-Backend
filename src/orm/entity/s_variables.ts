import { Column, Entity } from 'typeorm'

@Entity()
export class s_variables {
  @Column({ type: 'varchar', length: 50, unique: true, primary: true })
    key: string

  @Column({ type: 'text' })
    value: string
}
