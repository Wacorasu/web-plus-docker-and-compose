import { IsString, IsNotEmpty, IsJWT } from 'class-validator';

export class AuthJwtDto {
  @IsJWT()
  @IsNotEmpty()
  access_token: string;

  @IsString()
  expiresIn: string;
}
