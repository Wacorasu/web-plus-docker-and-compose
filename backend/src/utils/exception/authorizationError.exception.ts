import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthorizationErrorException extends HttpException {
  constructor() {
    super('Username or password is wrong', HttpStatus.UNAUTHORIZED);
  }
}
