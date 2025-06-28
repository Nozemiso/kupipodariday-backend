import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { WishesService } from '../wishes/wishes.service';
import { Offer } from './entities/offer.entity';

@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly wishesService: WishesService,
  ) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Req() req, @Body() createOfferDto: CreateOfferDto): Promise<Offer> {
    return this.offersService.create(req.user.id, createOfferDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) uuid: string): Promise<Offer> {
    return this.offersService.findOneById(uuid);
  }
}
