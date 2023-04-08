import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { BadRequestException } from '@nestjs/common/exceptions';
import { WishesService } from 'src/wishes/wishes.service';
import { UpdateWishDto } from 'src/wishes/dto/update-wish.dto';
import { OfferDto } from './dto/offer.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number) {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);

    if (userId === wish.owner.id) {
      throw new BadRequestException(
        'Вы не можете оплатить собственный подарок',
      );
    }

    if (wish.raised + createOfferDto.amount > wish.price) {
      throw new BadRequestException('Сумма доната превышает стоимость подарка');
    }

    await this.wishesService.update(wish.id, wish.owner.id, {
      raised: wish.raised + createOfferDto.amount,
    } as UpdateWishDto);

    const offer = await this.offerRepository.create({
      ...createOfferDto,
      userId: userId,
      item: wish,
    });

    await this.offerRepository.save(offer);

    return {};
  }

  async findAll(): Promise<OfferDto[]> {
    const offers = await this.offerRepository.find({
      relations: {
        item: true,
        user: true,
      },
    });

    return offers.map((offer) => plainToClass(OfferDto, offer));
  }

  async findOne(id: number): Promise<OfferDto> {
    const offer = await this.offerRepository.findOne({
      where: {
        id,
      },
      relations: {
        item: true,
        user: true,
      },
    });

    return plainToClass(OfferDto, offer);
  }
}
