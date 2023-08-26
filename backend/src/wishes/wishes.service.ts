import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateWishDto } from './dto/wish-create.dto';
import { DeleteResult, FindOptionsOrderValue, Repository } from 'typeorm';
import { Wish } from './entity/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateWishDto } from './dto/wish-update.dto';
import { PriceLockException } from 'src/utils/exception/price-lock.exception';
import { NotFoundException } from 'src/utils/exception/not-found.exception';
import { UpdateWishPrivateDto } from './dto/wish-update-private.dto';
import { selectUserDataDefault } from 'src/utils/queries/user-response-query';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async findLast(type: FindOptionsOrderValue): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      order: {
        createdAt: type,
      },
      relations: {
        wishList: true,
        owner: true,
      },
      select: {
        owner: selectUserDataDefault,
      },
      take: 40,
    });
    return wishes;
  }

  async findWishes(user: User): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      relations: {
        wishList: true,
        offers: true,
        owner: true,
      },
      select: {
        owner: selectUserDataDefault,
      },
      where: {
        owner: user,
      },
      take: 40,
    });
    return wishes;
  }

  async findTop(type: FindOptionsOrderValue): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      order: {
        copied: type,
      },
      relations: {
        wishList: true,
        owner: true,
      },
      select: {
        owner: selectUserDataDefault,
      },
      take: 20,
    });
    return wishes;
  }

  async findById(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      relations: {
        wishList: true,
        offers: true,
        owner: true,
      },
      select: {
        owner: selectUserDataDefault,
      },
      where: {
        id: id,
      },
    });
    if (!wish) {
      throw new NotFoundException();
    }
    return wish;
  }

  async createWish(createWishDto: CreateWishDto, user: User) {
    const date = new Date();
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: user,
      createdAt: date,
      updatedAt: date,
    });
    return await this.wishesRepository.save(wish);
  }

  async updateWish(user: User, payload: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findById(payload);
    if (!wish) {
      throw new NotFoundException();
    }
    if (user.id !== wish.owner.id) {
      throw new UnauthorizedException();
    }
    const currentDate: Date = new Date();
    if (updateWishDto.price && wish.offers?.length > 0) {
      throw new PriceLockException();
    }
    await this.wishesRepository.update(wish.id, {
      ...updateWishDto,
      updatedAt: currentDate,
    });
  }

  async deleteWish(payload: number, user: User): Promise<DeleteResult> {
    const wish = await this.findById(payload);
    if (!wish) {
      throw new NotFoundException();
    }
    if (user.id !== wish.owner.id) {
      throw new UnauthorizedException();
    }
    const deletedWish = await this.wishesRepository.delete(wish.id);
    return deletedWish;
  }

  async updatePrivateParamWish(
    wish: Wish,
    updateWishPrivateDto: UpdateWishPrivateDto,
  ) {
    const date = new Date();
    return await this.wishesRepository.update(wish.id, {
      ...updateWishPrivateDto,
      updatedAt: date,
    });
  }

  async copyWish(payload: number, user: User): Promise<Wish> {
    const wish = await this.findById(payload);
    if (!wish) {
      throw new NotFoundException();
    }
    const copyWish = await this.createWish(
      {
        name: wish.name,
        description: wish.description,
        link: wish.link,
        image: wish.image,
        price: wish.price,
      },
      user,
    );
    await this.updatePrivateParamWish(wish, {
      raised: Number(wish.raised),
      copied: Number(wish.copied) + 1,
    });

    return copyWish;
  }
}
