import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
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
    return this.findOne({ where: { username } });
  }

  findMany(options: FindManyOptions<User>) {
    return this.userRepository.find(options);
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

  deleteOne(options: FindOptionsWhere<User>) {
    return this.userRepository.delete(options);
  }
}
