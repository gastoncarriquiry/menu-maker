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

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  mealName!: string;

  @Column('text', { nullable: true })
  mealDescription?: string;

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

  @Column()
  plannedDate!: Date;

  @Column({ default: 'breakfast' })
  mealType!: string; // breakfast, lunch, dinner, snack

  @Column({ default: false })
  isCompleted!: boolean;

  @Column('text', { nullable: true })
  aiRecommendationId?: string; // Reference to AI recommendation

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.menuItems)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;
}
