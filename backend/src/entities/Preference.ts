import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

export enum PreferenceType {
  DIETARY = 'dietary',
  ALLERGIES = 'allergies',
  CUISINE = 'cuisine',
  COOKING_TIME = 'cooking_time',
  MEAL_TYPE = 'meal_type',
}

@Entity('preferences')
export class Preference {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: PreferenceType,
  })
  type!: PreferenceType;

  @Column()
  value!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.preferences)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;
}
