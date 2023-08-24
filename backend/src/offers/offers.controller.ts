import {
  Controller,
  UseGuards,
  Req,
  Body,
  Post,
  Get,
  Param,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/offer-create.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User } from '../users/entity/user.entity';
import { ParamDto } from 'src/users/dto/param.dto';
import { OffersService } from './offers.service';
import { Offer } from './entity/offer.entity';

@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createOffer(
    @Req() req: { user: User },
    @Body() createOfferDto: CreateOfferDto,
  ) {
    const offer = await this.offersService.createOffer(
      req.user,
      createOfferDto,
    );

    return offer;
  }

  @UseGuards(JwtGuard)
  @Get()
  async getOffers(@Req() req: { user: User }): Promise<Offer[]> {
    const offers = await this.offersService.findOffers(req.user);
    return offers;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getOffersById(
    @Req() req: { user: User },
    @Param() param: ParamDto,
  ): Promise<Offer> {
    const offer = await this.offersService.findById(param, req.user);
    return offer;
  }
}
