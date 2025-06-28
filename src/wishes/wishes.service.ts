import { Injectable } from '@nestjs/common';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  create(wish: Partial<Wish>) {
    return this.wishesRepository.save(wish);
  }

  findOne(options: FindOneOptions<Wish>) {
    return this.wishesRepository.findOne(options);
  }

  findMany(options: FindManyOptions<Wish>) {
    return this.wishesRepository.find(options);
  }

  updateOne(options: FindOptionsWhere<Wish>, wish: Partial<Wish>) {
    return this.wishesRepository.update(options, wish);
  }

  deleteOne(options: FindOptionsWhere<Wish>) {
    return this.wishesRepository.delete(options);
  }

  findAllByOwnerId(owner: string) {
    return this.wishesRepository.findBy({ owner: { id: owner } });
  }

  incCopies(id: string) {
    this.wishesRepository.update({ id }, { copied: () => 'copied + 1' });
  }

  addRaise(id: string, val: number) {
    console.log(
      this.wishesRepository.update({ id }, { raised: () => `raised + ${val}` }),
    );
  }
}
