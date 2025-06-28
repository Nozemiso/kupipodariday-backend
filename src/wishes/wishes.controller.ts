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
    return this.wishesService.getLast();
  }

  @Get('top')
  getTop(): Promise<Wish[]> {
    return this.wishesService.getTop();
  }

  @Get(':id')
  findById(@Param('id', new ParseUUIDPipe()) id: string): Promise<Wish> {
    return this.wishesService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateById(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateById(id, req.user.id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.wishesService.deleteOneById(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.wishesService.copy(id, req.user.id);
  }
}
