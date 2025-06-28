import { IsDate, IsEmail, IsString, IsUrl, IsUUID } from 'class-validator';

export class SignupUserResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  username: string;

  @IsString()
  about: string;

  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
