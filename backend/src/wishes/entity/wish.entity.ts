import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { PrimaryBaseModel } from 'src/utils/base-entity/primary-base-model.entity';
import { Length, IsUrl } from 'class-validator';
import { User } from 'src/users/entity/user.entity';
import { Offer } from 'src/offers/entity/offer.entity';
import { Wishlist } from 'src/wishlists/entity/wishlist.entity';

@Entity()
export class Wish extends PrimaryBaseModel {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    nullable: false,
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinColumn()
  owner: User;

  @Column({ nullable: false })
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  @JoinColumn()
  offers: Offer[];

  @Column({
    nullable: false,
    type: 'decimal',
    precision: 5,
    scale: 0,
    default: 0,
  })
  copied: number;

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.itemsId)
  wishList: Wishlist[];
}
