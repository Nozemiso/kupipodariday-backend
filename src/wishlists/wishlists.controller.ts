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
    return this.wishlistsService.create({
      ...createWishlistDto,
      items: createWishlistDto.itemsId.map((itemUUID: string) => {
        return { id: itemUUID } as Wish;
      }),
      owner: req.user.id,
    });
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) uuid: string): Promise<Wishlist> {
    return this.wishlistsService.findOneById(uuid);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) uuid: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.update(uuid, req.user.id, {
      ...updateWishlistDto,
      items: updateWishlistDto.itemsId.map((wishId) => {
        return { id: wishId } as Wish;
      }),
    });
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id', new ParseUUIDPipe()) uuid: string) {
    return this.wishlistsService.remove(uuid, req.user.id);
  }
}
