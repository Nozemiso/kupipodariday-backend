import { IsJWT, IsNotEmpty, IsString, Length } from 'class-validator';

export class SigninUserDTO {
  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class SigninUserResponseDTO {
  @IsJWT()
  access_token: string;
}
