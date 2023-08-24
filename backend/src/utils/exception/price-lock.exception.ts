import { HttpException, HttpStatus } from '@nestjs/common';

export class PriceLockException extends HttpException {
  constructor() {
    super('Price lock, users of offer exists', HttpStatus.BAD_REQUEST);
  }
}
