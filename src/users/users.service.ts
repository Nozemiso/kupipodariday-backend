import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Like,
  Repository,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);
    return this.userRepository
      .save({
        ...createUserDto,
        password: hashedPassword,
      })
      .then((user) => {
        return { ...user, password: undefined };
      });
  }

  findOne(options: FindOneOptions<User>) {
    return this.userRepository.findOne(options);
  }

  findOneById(id: string) {
    return this.findOne({ where: { id } });
  }

  findOneByUsername(username: string) {
    return this.findOne({ where: { username } }).then((user) => {
      if (!user) throw new NotFoundException();
      else return user;
    });
  }

  findWishesByUsername(username: string) {
    return this.findOne({ where: { username }, relations: ['wishes'] }).then(
      (user) => {
        if (!user) throw new NotFoundException();
        else return user.wishes;
      },
    );
  }

  findMany(options: FindManyOptions<User>) {
    return this.userRepository.find(options);
  }

  searchByUsernameEmail(query: string) {
    return this.findMany({
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
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

  updateOne(options: FindOptionsWhere<User>, updateUserDto: UpdateUserDto) {
    let hashedPassword;
    if (updateUserDto.password) {
      hashedPassword = bcrypt.hashSync(updateUserDto.password, 10);
    }
    return this.userRepository
      .update(options, {
        ...updateUserDto,
        password: hashedPassword || undefined,
      })
      .then(() => {
        return Promise.all([
          this.userRepository.findOne({ where: options }),
          this.userRepository.findOne({ where: options, select: ['email'] }),
        ]).then(([userData, emailUserData]) => {
          return { ...userData, email: emailUserData.email };
        });
      });
  }

  updateOneById(id: string, updateUserDto: UpdateUserDto) {
    return this.updateOne({ id }, updateUserDto);
  }

  deleteOne(options: FindOptionsWhere<User>) {
    return this.userRepository.delete(options);
  }
}
