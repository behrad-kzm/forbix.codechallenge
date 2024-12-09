import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityHelper } from '../../utils/common/entity-helper';
import { User } from '../../user/entities/user.entity';
import { Company } from './company.entity';

@Index('userId_companyId_index', ['userId', 'companyId'], { unique: true })
@Index('userId_index', ['userId'])
@Entity()
export class UserCompany extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: User;

  @Column()
  userId!: string;

  @ManyToOne(() => Company, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'companyId', referencedColumnName: 'id' })
  company?: Company;

  @Column()
  companyId!: string;
}
