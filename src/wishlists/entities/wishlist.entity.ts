import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { IsUrl, Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { Metadata } from '../../common/entities/common.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wishlist extends Metadata {
  @Column()
  @Length(1, 250)
  name: string;

  @Column({ nullable: true })
  @Length(0, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user: User) => user.wishlists)
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
