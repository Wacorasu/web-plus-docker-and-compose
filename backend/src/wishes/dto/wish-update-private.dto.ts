import { IsNumber, IsOptional } from 'class-validator';

export class UpdateWishPrivateDto {
  @IsNumber()
  @IsOptional()
  raised: number;

  @IsNumber()
  @IsOptional()
  copied: number;
}
