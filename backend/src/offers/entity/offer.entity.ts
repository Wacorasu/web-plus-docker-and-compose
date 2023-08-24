import { Entity, Column, ManyToOne } from 'typeorm';
import { PrimaryBaseModel } from 'src/utils/base-entity/primary-base-model.entity';
import { OFFER_HIDDEN_DEFAULT } from 'src/utils/constants';
import { User } from 'src/users/entity/user.entity';
import { Wish } from 'src/wishes/entity/wish.entity';

@Entity()
export class Offer extends PrimaryBaseModel {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({ nullable: false, type: 'decimal', precision: 5, scale: 2 })
  amount: number;

  @Column({ default: OFFER_HIDDEN_DEFAULT })
  hidden: boolean;
}
