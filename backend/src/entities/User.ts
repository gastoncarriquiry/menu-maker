import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Menu } from './Menu';
import { Preference } from './Preference';
import { MenuItem } from './MenuItem';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToMany(() => Menu, (menu) => menu.user)
  menus!: Menu[];

  @OneToMany(() => Preference, (preference) => preference.user)
  preferences!: Preference[];

  @OneToMany(() => MenuItem, (menuItem) => menuItem.user)
  menuItems!: MenuItem[];
}
