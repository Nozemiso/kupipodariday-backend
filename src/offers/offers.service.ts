import { Injectable } from '@nestjs/common';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
  ) {}
  create(offer: Partial<Offer>) {
    return this.offersRepository.save(offer);
  }

  findAll() {
    return this.offersRepository.find();
  }

  findOne(id: string) {
    return this.offersRepository.findOneBy({ id });
  }

  update(userId: string, id: string, updateOfferDto: UpdateOfferDto) {
    return this.offersRepository.update(id, {
      ...updateOfferDto,
      user: { id: userId },
      item: { id: updateOfferDto.itemId },
    });
  }

  remove(id: string) {
    return this.offersRepository.delete(id);
  }
}
