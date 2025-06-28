import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Metadata } from '../../common/entities/common.entity';
import { IsDefined, IsUrl, Length } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Wish extends Metadata {
  @Column()
  @IsDefined()
  name: string;

  @Column()
  @IsUrl()
  @IsDefined()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'decimal', scale: 2 })
  @IsDefined()
  price: number;

  @Column({ type: 'decimal', scale: 2, default: 0 })
  raised: number;

  @ManyToOne(() => User, (user: User) => user.wishes)
  @JoinColumn({ name: 'user_id' })
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  copied: number;
}
