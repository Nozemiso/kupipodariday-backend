import { IsDefined, IsNumber, IsOptional, IsUrl } from 'class-validator';

export class CreateWishDto {
  @IsDefined()
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  price: number;

  @IsOptional()
  description: string;
}
