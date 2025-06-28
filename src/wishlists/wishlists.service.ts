import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  TypeORMError,
} from 'typeorm';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  create(wishlist: Partial<Wishlist>) {
    return this.wishlistRepository.save(wishlist).catch(() => {
      throw new BadRequestException();
    });
  }

  findOne(options: FindOneOptions<Wishlist>) {
    return this.wishlistRepository.findOne(options).then((wishlist) => {
      if (!wishlist) throw new NotFoundException();
      else return wishlist;
    });
  }

  findOneById(id: string) {
    return this.findOne({ where: { id: id }, relations: ['items', 'owner'] });
  }

  findMany(options: FindManyOptions<Wishlist>) {
    return this.wishlistRepository.find(options);
  }

  update(targetId: string, authorId: string, newWishlist: Partial<Wishlist>) {
    return this.findOne({
      where: { id: targetId },
      relations: ['owner', 'items'],
    })
      .then((wishlist) => {
        if (wishlist.owner.id !== authorId) throw new ForbiddenException();
        this.wishlistRepository.save({ ...wishlist, ...newWishlist });
      })
      .catch((err) => {
        if (err instanceof TypeORMError) throw new BadRequestException();
        else throw err;
      })
      .then(() => {
        return this.findOne({ where: { id: targetId } });
      });
  }

  remove(targetId: string, authorId: string) {
    return this.findOne({ where: { id: targetId }, relations: ['owner'] }).then(
      (wishlist) => {
        if (wishlist.owner.id !== authorId) throw new ForbiddenException();
        else return this.wishlistRepository.remove(wishlist);
      },
    );
  }
}
