import { Optional } from '@nestjs/common';

export class UpdateUserDto {
  @Optional()
  username: string;
  @Optional()
  about: string;
  @Optional()
  avatar: string;
  @Optional()
  email: string;
  @Optional()
  password: string;
}
