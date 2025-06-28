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
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { ApiTags } from '@nestjs/swagger';
import { Wish } from '../wishes/entities/wish.entity';
import { JwtGuard } from '../auth/jwt.guard';
import { Wishlist } from './entities/wishlist.entity';

@ApiTags('wishlists')
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findMany(null);
  }

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Req() req,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService
      .create({
        ...createWishlistDto,
        items: createWishlistDto.itemsId.map((itemUUID: string) => {
          return { id: itemUUID } as Wish;
        }),
        owner: req.user.id,
      })
      .catch(() => {
        throw new BadRequestException();
      });
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) uuid: string): Promise<Wishlist> {
    return this.wishlistsService
      .findOne({ where: { id: uuid }, relations: ['owner', 'items'] })
      .then((wishlist: Wishlist) => {
        if (!wishlist) throw new NotFoundException();
        else return wishlist;
      });
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) uuid: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService
      .findOne({ where: { id: uuid }, relations: ['owner'] })
      .then((wishlist: Wishlist) => {
        if (!wishlist) throw new NotFoundException();
        if (wishlist.owner.id !== uuid) throw new ForbiddenException();
        this.wishlistsService.update(uuid, updateWishlistDto);
      })
      .catch(() => {
        throw new BadRequestException();
      })
      .then(() => {
        return this.wishlistsService.findOne({ where: { id: uuid } });
      });
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) uuid: string) {
    return this.wishlistsService
      .findOne({ where: { id: uuid }, relations: ['owner'] })
      .then((wishlist: Wishlist) => {
        if (!wishlist) throw new NotFoundException();
        if (wishlist.owner.id !== uuid) throw new ForbiddenException();
        return this.wishlistsService.remove(uuid);
      });
  }
}
