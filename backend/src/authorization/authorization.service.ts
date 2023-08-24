import { Injectable } from '@nestjs/common';
import { User } from '../users/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthorizationErrorException } from 'src/utils/exception/authorizationError.exception';
import { AuthJwtDto } from './dto/authorization.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: User): AuthJwtDto {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(`${payload.sub}`),
      expiresIn: '3d',
    };
  }

  async validatePassword(
    username: string,
    inputPassword: string,
  ): Promise<User> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new AuthorizationErrorException();
    }

    const compare = await this.usersService.comparePassword(
      inputPassword,
      user?.password,
    );

    if (!compare) {
      throw new AuthorizationErrorException();
    }
    return user;
  }
}
