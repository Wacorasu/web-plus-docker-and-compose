import { IsString, Length, IsEmail, IsUrl, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(2, 30)
  @IsOptional()
  username: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
