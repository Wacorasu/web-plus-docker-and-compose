import {
  IsString,
  Length,
  IsEmail,
  IsNotEmpty,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
