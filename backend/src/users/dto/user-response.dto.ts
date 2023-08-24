import {
  IsString,
  Length,
  IsEmail,
  IsUrl,
  IsOptional,
  IsDate,
  IsNumber,
} from 'class-validator';

export class UserResponse {
  @IsNumber()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @Length(2, 200)
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;
}
