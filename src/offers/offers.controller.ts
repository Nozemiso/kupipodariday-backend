import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Req,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';
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
    const userId = req.user.id;
    return this.wishesService
      .findOne({ where: { id: createOfferDto.itemId }, relations: ['owner'] })
      .then((wish) => {
        if (!wish) throw new NotFoundException();
        else if (+wish.raised + createOfferDto.amount >= +wish.price)
          throw new ForbiddenException('Нельзя вносить избыточную сумму');
        else if (wish.owner.id == userId)
          throw new ForbiddenException(
            'Нельзя вносить деньги на собственные подарки',
          );
        else return wish;
      })
      .then(() => {
        this.wishesService.addRaise(
          createOfferDto.itemId,
          createOfferDto.amount,
        );
        return this.offersService.create({
          ...createOfferDto,
          user: userId,
          item: { id: createOfferDto.itemId } as Wish,
        });
      });
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) uuid: string): Promise<Offer> {
    return this.offersService.findOne(uuid).then((offer) => {
      if (!offer) throw new NotFoundException();
      else return offer;
    });
  }
}
