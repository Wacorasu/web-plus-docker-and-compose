import { IsNumberString } from 'class-validator';

export class ParamDto {
  @IsNumberString()
  id: number;
}
