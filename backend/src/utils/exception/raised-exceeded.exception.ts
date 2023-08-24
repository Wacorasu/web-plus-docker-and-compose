import { HttpException, HttpStatus } from '@nestjs/common';

export class RaisedISExceededException extends HttpException {
  constructor() {
    super('Donation amount will be exceeded', HttpStatus.BAD_REQUEST);
  }
}
