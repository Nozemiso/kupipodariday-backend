import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { User } from '../users/entities/user.entity';
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
    return this.wishesRepository.findOne(options).then((wish) => {
      if (!wish) throw new NotFoundException();
      else return wish;
    });
  }

  findById(id: string) {
    return this.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });
  }

  findMany(options: FindManyOptions<Wish>) {
    return this.wishesRepository.find(options);
  }

  getTop() {
    return this.findMany({
      relations: ['owner'],
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  getLast() {
    return this.findMany({
      relations: ['owner'],
      order: { createdAt: 'desc' },
      take: 40,
    });
  }

  updateOne(options: FindOptionsWhere<Wish>, wish: Partial<Wish>) {
    return this.wishesRepository.update(options, wish);
  }

  updateById(targetId: string, authorId: string, newWish: Partial<Wish>) {
    return this.findOne({
      where: { id: targetId },
      relations: ['owner'],
    }).then((wish) => {
      if (wish.owner.id !== authorId) throw new ForbiddenException();
      else if (+wish.raised > 0) throw new ForbiddenException();
      else return this.updateOne({ id: targetId }, newWish);
    });
  }

  deleteOne(options: FindOptionsWhere<Wish>) {
    return this.wishesRepository.delete(options);
  }

  deleteOneById(id: string, authorId: string) {
    return this.findOne({ where: { id: id }, relations: ['owner'] }).then(
      (wish) => {
        if (+wish.raised > 0) throw new ForbiddenException();
        else if (wish.owner.id !== authorId) throw new ForbiddenException();
        else return this.deleteOne({ id: id });
      },
    );
  }

  findAllByOwnerId(owner: string) {
    return this.wishesRepository.findBy({ owner: { id: owner } });
  }

  copy(targetWishId: string, targetUserId: string) {
    return this.findOne({ where: { id: targetWishId } }).then((wish) => {
      const newWish = {
        name: wish.name,
        link: wish.link,
        image: wish.image,
        price: wish.price,
        description: wish.description,
        owner: { id: targetUserId } as User,
      };
      this.incCopies(targetWishId);
      return this.create(newWish);
    });
  }

  incCopies(id: string) {
    this.wishesRepository.update({ id }, { copied: () => 'copied + 1' });
  }

  addRaise(id: string, val: number) {
    return this.wishesRepository.update(
      { id },
      { raised: () => `raised + ${val}` },
    );
  }
}
