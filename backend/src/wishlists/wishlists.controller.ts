import {
  Controller,
  UseGuards,
  Req,
  Body,
  Post,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User } from '../users/entity/user.entity';
import { ParamDto } from 'src/users/dto/param.dto';
import { CreateWishListDto } from './dto/whishlist-create.dto';
import { WishlistsService } from './wishlists.service';
import { Wishlist } from './entity/wishlist.entity';
import { UpdateWishListDto } from './dto/wishlist-update.dto';

@Controller('wishlists')
export class WishlistsController {
  constructor(private wishListService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createWishList(
    @Req() req: { user: User },
    @Body() createWishList: CreateWishListDto,
  ) {
    const wish = await this.wishListService.createWishList(
      createWishList,
      req.user,
    );
    return wish;
  }

  @UseGuards(JwtGuard)
  @Get()
  async findWishLists(@Req() req: { user: User }): Promise<Wishlist[]> {
    const wishLists = await this.wishListService.findWishLists(req.user);
    return wishLists;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getWishById(@Param() param: ParamDto): Promise<Wishlist> {
    const wishList = await this.wishListService.findById(param.id);
    return wishList;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWish(
    @Req() req: { user: User },
    @Body() updateWishListDto: UpdateWishListDto,
    @Param() param: ParamDto,
  ) {
    const wishlist = await this.wishListService.updateWishList(
      req.user,
      param.id,
      updateWishListDto,
    );

    return wishlist;
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWish(
    @Req() req: { user: User },
    @Param() param: ParamDto,
  ): Promise<Wishlist> {
    const removedWishList = await this.wishListService.deleteWishList(
      param.id,
      req.user,
    );
    return removedWishList;
  }
}
