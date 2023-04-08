import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUrl, MaxLength, MinLength } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'Wishes' })
export class Wish {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  originalId?: number;

  @ManyToOne(() => Wish, (wish) => wish.copies, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'originalId' })
  copies: Wish[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @Column()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({
    scale: 2,
    default: 0,
  })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: number;

  @Column()
  @MinLength(1)
  @MaxLength(1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({
    default: 0,
  })
  @IsInt()
  copied: number;
}
