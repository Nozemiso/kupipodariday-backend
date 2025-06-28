import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { WishesService } from '../wishes/wishes.service';
import { FindUsersDto } from './dto/find-users.dto';
import { UserDTO } from './dto/user-dto.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { UserPublicDto } from './dto/user-public.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@Req() req): Promise<UserDTO> {
    return this.usersService.findOneById(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  updateMe(@Req() req, @Body() updateUserDto: UpdateUserDto): Promise<UserDTO> {
    return this.usersService.updateOne({ id: req.user.id }, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  getMyWishes(@Req() req): Promise<Wish[]> {
    return this.wishesService.findAllByOwnerId(req.user.id);
  }

  @Post('find')
  getMany(@Body() findUserDTO: FindUsersDto): Promise<UserDTO[]> {
    return this.usersService.findMany({
      where: [{ username: findUserDTO.query }, { email: findUserDTO.query }],
      select: [
        'id',
        'username',
        'email',
        'about',
        'avatar',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  @Get(':username')
  findByUsername(@Param('username') username: string): Promise<UserPublicDto> {
    return this.usersService.findOneByUsername(username).then((user) => {
      if (!user) throw new NotFoundException();
      else return user;
    });
  }

  @Get(':username/wishes')
  findWishesByUsername(@Param('username') username: string): Promise<Wish[]> {
    return this.usersService
      .findOne({ where: { username }, relations: ['wishes'] })
      .then((user) => {
        if (!user) throw new NotFoundException();
        else return user.wishes;
      });
  }
}
