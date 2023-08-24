import { IsString, Length, IsUrl, IsArray, IsOptional } from 'class-validator';

export class CreateWishListDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  itemsId: number[];

  @IsString()
  @Length(1, 1500)
  @IsOptional()
  description: string;
}
