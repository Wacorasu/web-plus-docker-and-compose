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

@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getUser(@Req() req: { user: User }): UserResponse {
    return req.user;
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
