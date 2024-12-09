import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { EntityHelper } from '../../utils/common/entity-helper';

@Index('email_index', ['email'])
@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;
}
