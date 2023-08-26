import { Entity, Column, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { PrimaryBaseModel } from 'src/utils/base-entity/primary-base-model.entity';
import { Length, IsUrl } from 'class-validator';
import { Wish } from 'src/wishes/entity/wish.entity';
import { User } from 'src/users/entity/user.entity';

@Entity()
export class Wishlist extends PrimaryBaseModel {
  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  @Length(0, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.wishList)
  @JoinTable()
  itemsId: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
