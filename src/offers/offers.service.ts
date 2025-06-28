import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  create(userId: string, createOfferDto: CreateOfferDto) {
    return this.wishesService
      .findOne({ where: { id: createOfferDto.itemId }, relations: ['owner'] })
      .then((wish) => {
        if (!wish) throw new NotFoundException();
        else if (+wish.raised + createOfferDto.amount >= +wish.price)
          throw new ForbiddenException('Нельзя вносить избыточную сумму');
        else if (wish.owner.id == userId)
          throw new ForbiddenException(
            'Нельзя вносить деньги на собственные подарки',
          );
        else return wish;
      })
      .then(() => {
        this.wishesService.addRaise(
          createOfferDto.itemId,
          createOfferDto.amount,
        );
        return this.offersRepository.save({
          ...createOfferDto,
          user: { id: userId },
          item: { id: createOfferDto.itemId },
        });
      });
  }

  findAll() {
    return this.offersRepository.find();
  }

  findOneById(id: string) {
    return this.offersRepository.findOneBy({ id }).then((offers) => {
      if (!offers) throw new NotFoundException();
      else return offers;
    });
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
