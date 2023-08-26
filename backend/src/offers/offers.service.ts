import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Offer } from './entity/offer.entity';
import { CreateOfferDto } from './dto/offer-create.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { OfferToHimselfException } from 'src/utils/exception/offer-to-himsels.exception';
import { RaisedISExceededException } from 'src/utils/exception/raised-exceeded.exception';
import { NotFoundException } from 'src/utils/exception/not-found.exception';
import { ParamDto } from 'src/users/dto/param.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
    private readonly dataSource: DataSource,
  ) {}

  async createOffer(user: User, createOfferDto: CreateOfferDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    const wish = await this.wishesService.findById(createOfferDto.itemId);
    if (wish.owner.id === user.id) {
      throw new OfferToHimselfException();
    }
    if (Number(wish.raised) + createOfferDto.amount > Number(wish.price)) {
      throw new RaisedISExceededException();
    }
    const date = new Date();
    const offer = this.offerRepository.create({
      amount: createOfferDto.amount,
      hidden: createOfferDto.hidden,
      createdAt: date,
      updatedAt: date,
      user: user,
      username: user?.username,
      item: wish,
    });
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.offerRepository.save(offer);
      await this.wishesService.updatePrivateParamWish(wish, {
        raised: Number(wish.raised) + createOfferDto.amount,
        copied: Number(wish.copied),
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return {};
  }

  async findById(payload: ParamDto, user: User): Promise<Offer> {
    const id = Number(payload.id);
    const offer = await this.offerRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        item: true,
        user: true,
      },
    });
    if (!offer) {
      throw new NotFoundException();
    }
    if (user.id !== offer?.user.id) {
      throw new UnauthorizedException();
    }
    return offer;
  }

  async findOffers(user: User): Promise<Offer[]> {
    const offer = await this.offerRepository.find({
      where: {
        user: user,
      },
      relations: {
        item: true,
        user: true,
      },
    });

    return offer;
  }
}
