import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from 'src/utils/exception/not-found.exception';
import { Repository } from 'typeorm';
import { Wishlist } from './entity/wishlist.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { UpdateWishListDto } from './dto/wishlist-update.dto';
import { CreateWishListDto } from './dto/whishlist-create.dto';
import { selectUserDataDefault } from 'src/utils/queries/user-response-query';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async findWishLists(user: User): Promise<Wishlist[]> {
    const wishLists = await this.wishListRepository.find({
      where: {
        owner: user,
      },
      relations: {
        itemsId: true,
        owner: true,
      },
      select: {
        owner: selectUserDataDefault,
      },
    });
    return wishLists;
  }

  async findById(payload: number): Promise<Wishlist> {
    const wishList = await this.wishListRepository.findOne({
      where: {
        id: payload,
      },
      relations: {
        itemsId: true,
        owner: true,
      },
      select: {
        owner: selectUserDataDefault,
      },
    });
    if (!wishList) {
      throw new NotFoundException();
    }
    return wishList;
  }

  async createWishList(
    createWishListDto: CreateWishListDto,
    user: User,
  ): Promise<Wishlist> {
    const date = new Date();
    console.log(createWishListDto.itemsId);
    const items = await Promise.all(
      createWishListDto.itemsId.map((item) =>
        this.wishesService.findById(item),
      ),
    );
    const wish = this.wishListRepository.create({
      ...createWishListDto,
      owner: user,
      createdAt: date,
      updatedAt: date,
      itemsId: [...items],
    });
    return await this.wishListRepository.save(wish);
  }

  async updateWishList(
    user: User,
    payload: number,
    updateWishListDto: UpdateWishListDto,
  ): Promise<Wishlist> {
    const wishList = await this.findById(payload);
    if (user.id !== wishList.owner.id) {
      throw new UnauthorizedException();
    }
    const items = await Promise.all(
      updateWishListDto.itemsId.map((item) =>
        this.wishesService.findById(item),
      ),
    );
    const currentDate: Date = new Date();
    await this.wishListRepository.save({
      ...wishList,
      ...updateWishListDto,
      updatedAt: currentDate,
      itemsId: [...items],
    });
    return await this.findById(wishList.id);
  }

  async deleteWishList(payload: number, user: User): Promise<Wishlist> {
    const wishList = await this.findById(payload);
    if (user.id !== wishList.owner.id) {
      throw new UnauthorizedException();
    }
    await this.wishListRepository.delete(wishList.id);
    return wishList;
  }
}
