import { IsOptional, IsString, IsUrl, IsUUID, Length } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsString()
  @Length(1, 1500)
  @IsOptional()
  description: string;

  @IsUrl()
  image: string;

  @IsUUID('4', { each: true })
  itemsId: string[];
}
