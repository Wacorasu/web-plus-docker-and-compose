import { IsNumberString } from 'class-validator';

export class ParamWishDto {
  @IsNumberString()
  id: number;
}
