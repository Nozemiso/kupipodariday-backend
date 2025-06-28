import { Injectable } from '@nestjs/common';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  create(wishlist: Partial<Wishlist>) {
    return this.wishlistRepository.save(wishlist);
  }

  findOne(options: FindOneOptions<Wishlist>) {
    return this.wishlistRepository.findOne(options);
  }

  findMany(options: FindManyOptions<Wishlist>) {
    return this.wishlistRepository.find(options);
  }

  update(id: string, updateWishlistDto: UpdateWishlistDto) {
    return this.wishlistRepository.update(id, {
      ...updateWishlistDto,
      items: updateWishlistDto.itemsId.map((itemId) => {
        return { id: itemId };
      }),
    });
  }

  remove(id: string) {
    return this.wishlistRepository.delete(id);
  }
}
