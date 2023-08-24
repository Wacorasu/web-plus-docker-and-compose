import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { WishesModule } from 'src/wishes/wishes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entity/wishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), WishesModule],
  providers: [WishlistsService],
  controllers: [WishlistsController],
})
export class WishlistsModule {}
