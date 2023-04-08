import {
  IsNumber,
  IsOptional,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'Wishlists' })
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @Column()
  @IsOptional()
  @MinLength(1)
  @MaxLength(1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @IsNumber()
  ownerId: number;

  @ManyToOne(() => User, (user) => user.wishlistes)
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
