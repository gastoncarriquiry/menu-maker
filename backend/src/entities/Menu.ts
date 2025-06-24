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

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('simple-array', { nullable: true })
  ingredients?: string[];

  @Column('text', { nullable: true })
  instructions?: string;

  @Column({ nullable: true })
  prepTimeMinutes?: number;

  @Column({ nullable: true })
  cookTimeMinutes?: number;

  @Column({ nullable: true })
  servings?: number;

  @Column({ nullable: true })
  calories?: number;

  @Column({ default: false })
  isFavorite!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.menus)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;
}
