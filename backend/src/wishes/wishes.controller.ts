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
import { CreateWishDto } from './dto/wish-create.dto';
import { WishesService } from './wishes.service';
import { Wish } from './entity/wish.entity';
import { SORTING_TYPE } from 'src/utils/constants';
import { DeleteResult } from 'typeorm';
import { UpdateWishDto } from './dto/wish-update.dto';
import { ParamWishDto } from './dto/paramWish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createWish(
    @Req() req: { user: User },
    @Body() createWishDto: CreateWishDto,
  ) {
    const wish = this.wishesService.createWish(createWishDto, req.user);
    return wish;
  }

  @Get('last')
  async findLastWish(): Promise<Wish[]> {
    const wish = await this.wishesService.findLast(SORTING_TYPE.DESC);
    return wish;
  }

  @Get('top')
  async findTopWish(): Promise<Wish[]> {
    const wish = await this.wishesService.findTop(SORTING_TYPE.DESC);
    return wish;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getWishById(@Param() param: ParamWishDto): Promise<Wish> {
    const id = Number(param.id);
    const wish = await this.wishesService.findById(id);
    return wish;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWish(
    @Req() req: { user: User },
    @Body() updateWish: UpdateWishDto,
    @Param() param: ParamWishDto,
  ) {
    await this.wishesService.updateWish(req.user, param.id, updateWish);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWish(
    @Req() req: { user: User },
    @Param() param: ParamWishDto,
  ): Promise<DeleteResult> {
    const deletedWish = await this.wishesService.deleteWish(param.id, req.user);
    return deletedWish;
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(
    @Req() req: { user: User },
    @Param() param: ParamWishDto,
  ): Promise<Wish> {
    const copyWish = await this.wishesService.copyWish(param.id, req.user);
    return copyWish;
  }
}
