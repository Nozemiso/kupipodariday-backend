import { IsBoolean, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateOfferDto {
  @IsUUID()
  itemId: string;

  @IsNumber()
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden = false;
}
