import { IsString, Length, IsUrl, IsNumber } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  @Length(1, 1024)
  description: string;

  @IsUrl()
  image: string;

  @IsUrl()
  link: string;

  @IsNumber()
  price: number;
}
