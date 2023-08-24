import { HttpException, HttpStatus } from '@nestjs/common';

export class OfferToHimselfException extends HttpException {
  constructor() {
    super('The offer itself is forbidden', HttpStatus.BAD_REQUEST);
  }
}
