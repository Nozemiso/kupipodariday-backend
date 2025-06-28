import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SigninUserDTO } from './dto/signin-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  validatePassword(loginDTO: SigninUserDTO) {
    const userData = this.usersService.findOneByUsername(loginDTO.username);
    const hashedPasswordData = this.usersService.findOne({
      where: { username: loginDTO.username },
      select: ['password'],
    });

    return Promise.all([userData, hashedPasswordData]).then(
      ([userData, hashedPasswordData]) => {
        if (
          !userData ||
          !bcrypt.compareSync(loginDTO.password, hashedPasswordData.password)
        )
          throw new UnauthorizedException('Некорректная пара логин и пароль');
        return userData;
      },
    );
  }

  auth(user: User) {
    return {
      access_token: this.jwtService.sign(
        { user: user.id },
        {
          expiresIn: '7d',
          secret: this.configService.get('jwt'),
        },
      ),
    };
  }

  register(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto).catch(() => {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    });
  }
}
