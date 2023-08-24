import { IsString, Length, IsUrl, IsNumber, IsOptional } from 'class-validator';

export class UpdateWishDto {
  @IsString()
  @Length(1, 250)
  @IsOptional()
  name: string;

  @IsOptional()
  @IsString()
  @Length(1, 1024)
  description: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsUrl()
  @IsOptional()
  link: string;

  @IsNumber()
  @IsOptional()
  price: number;
}
