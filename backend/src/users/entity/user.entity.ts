import { Entity, Column, JoinColumn, OneToMany } from 'typeorm';
import { PrimaryBaseModel } from 'src/utils/base-entity/primary-base-model.entity';
import { Length, IsUrl, IsEmail } from 'class-validator';
import { USER_ABOUT_DEFAULT, USER_AVATAR_DEFAULT } from 'src/utils/constants';
import { Offer } from 'src/offers/entity/offer.entity';
import { Wish } from 'src/wishes/entity/wish.entity';
import { Wishlist } from 'src/wishlists/entity/wishlist.entity';

@Entity()
export class User extends PrimaryBaseModel {
  @Column({ unique: true, nullable: false })
  @Length(2, 30)
  username: string;

  @Column({ default: USER_ABOUT_DEFAULT })
  @Length(2, 200)
  about: string;

  @Column({ default: USER_AVATAR_DEFAULT })
  @IsUrl()
  avatar: string;

  @Column({ unique: true, nullable: false })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner, { onDelete: 'CASCADE' })
  @JoinColumn()
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  @JoinColumn()
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  @JoinColumn()
  wishlists: Wishlist[];
}
