import { Column, Entity, OneToMany } from 'typeorm';
import { Metadata } from '../../common/entities/common.entity';
import { IsDefined, IsEmail, IsNotEmpty, IsUrl, Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class User extends Metadata {
  @Column({ unique: true })
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  @Column('varchar', {
    default: 'Пока ничего не рассказал о себе',
    nullable: false,
  })
  @Length(2, 200)
  about: string;

  @Column('varchar', { default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  @IsNotEmpty()
  avatar: string;

  @Column('varchar', { unique: true, select: false })
  @IsEmail()
  email: string;

  @Column({ select: false })
  @IsDefined()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner, { onDelete: 'CASCADE' })
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user, { onDelete: 'NO ACTION' })
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.id)
  wishlists: Wishlist[];
}
