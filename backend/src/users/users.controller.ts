import {
  Controller,
  UseGuards,
  Req,
  Get,
  Param,
  Patch,
  Body,
  Post,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ParamDto } from './dto/param.dto';
import { UpdateUserDto } from './dto/user-update.dto';
import { User } from './entity/user.entity';
import { UserResponse } from './dto/user-response.dto';
import { Wish } from 'src/wishes/entity/wish.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Controller('/users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getUser(@Req() req: { user: User }): UserResponse {
    return req.user;
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async getUserWishes(@Req() req: { user: User }): Promise<Wish[]> {
    const wishes = await this.wishesService.findWishes(req.user);
    return wishes;
  }

  @UseGuards(JwtGuard)
  @Get(':id/wishes')
  async getUserIdWishes(@Param() param: ParamDto): Promise<Wish[]> {
    const user = await this.usersService.findById(param.id);
    const wishes = await this.wishesService.findWishes(user);
    return wishes;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getUserById(@Param() param: ParamDto): Promise<UserResponse> {
    const user = await this.usersService.findById(param.id);
    return user;
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateUserInfo(
    @Req() req: { user: User },
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.usersService.updateUser(req.user, updateUserDto);
    const { password, ...result } = user;
    return result;
  }

  @UseGuards(JwtGuard)
  @Post('find')
  async findUsers(
    @Req() req: { user: User },
    @Body() payload: { query: string },
  ): Promise<UserResponse[]> {
    const user = await this.usersService.findMany(payload.query);
    return user;
  }
}
