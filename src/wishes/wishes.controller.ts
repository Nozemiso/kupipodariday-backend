import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Req,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { ApiTags } from '@nestjs/swagger';
import { Wish } from './entities/wish.entity';
import { JwtGuard } from '../auth/jwt.guard';

@ApiTags('wishes')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createWishDto: CreateWishDto): Promise<Wish> {
    return this.wishesService.create({ ...createWishDto, owner: req.user.id });
  }

  @Get('last')
  getLast(): Promise<Wish[]> {
    return this.wishesService.findMany({
      relations: ['owner'],
      order: { createdAt: 'desc' },
      take: 40,
    });
  }

  @Get('top')
  getTop(): Promise<Wish[]> {
    return this.wishesService.findMany({
      relations: ['owner'],
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  @Get(':id')
  findById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Wish> {
    return this.wishesService
      .findOne({
        where: { id: id },
        relations: ['owner', 'offers', 'offers.user'],
      })
      .then((wish) => {
        if (!wish) throw new NotFoundException();
        else return wish;
      });
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateById(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService
      .findOne({ where: { id: id }, relations: ['owner'] })
      .then((wish) => {
        if (!wish) throw new NotFoundException();
        else if (wish.owner.id !== req.user.id) throw new ForbiddenException();
        else if (wish.raised > 0) throw new ForbiddenException();
        else return this.wishesService.updateOne({ id: id }, updateWishDto);
      });
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.wishesService
      .findOne({ where: { id: id }, relations: ['owner'] })
      .then((wish) => {
        if (!wish) throw new NotFoundException();
        else if (wish.owner.id !== req.user.id) throw new ForbiddenException();
        else if (wish.raised > 0) throw new ForbiddenException();
        return this.wishesService.deleteOne({ id });
      });
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.wishesService.findOne({ where: { id: id } }).then((wish) => {
      if (!wish) throw new NotFoundException();
      else {
        const newWish = {
          name: wish.name,
          link: wish.link,
          image: wish.image,
          price: wish.price,
          description: wish.description,
          owner: req.user.id,
        };
        console.log(wish as CreateWishDto);
        this.wishesService.incCopies(wish.id);
        return this.wishesService.create(newWish);
      }
    });
  }
}
