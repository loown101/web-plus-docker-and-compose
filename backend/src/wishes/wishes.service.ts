import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishDto } from './dto/wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number) {
    const newWish = await this.wishRepository.save({
      ...createWishDto,
      ownerId: userId,
    });

    await plainToClass(WishDto, newWish);

    return {};
  }

  async findAll(): Promise<WishDto[]> {
    const wishes = await this.wishRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
    });

    return wishes.map((wish) => plainToClass(WishDto, wish));
  }

  async findLast(): Promise<WishDto[]> {
    const wishes = await this.wishRepository.find({
      take: 40,
      order: {
        createdAt: 'DESC',
      },
      relations: {
        owner: true,
        offers: true,
      },
    });

    await wishes.map((wish) => delete wish.owner.email);

    return wishes.map((wish) => plainToClass(WishDto, wish));
  }

  async findTop(): Promise<WishDto[]> {
    const wishes = await this.wishRepository.find({
      take: 10,
      order: {
        copied: 'DESC',
      },
      relations: {
        owner: true,
        offers: true,
      },
    });

    await wishes.map((wish) => delete wish.owner.email);

    return wishes.map((wish) => plainToClass(WishDto, wish));
  }

  async findOne(id: number): Promise<WishDto> {
    const wish = await this.wishRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        offers: true,
      },
    });

    delete wish.owner.email;

    return plainToClass(WishDto, wish);
  }

  async getWish(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOneBy({ id });

    return wish;
  }

  async findMany(id: number): Promise<WishDto[]> {
    const wishes = await this.wishRepository.find({
      where: {
        ownerId: id,
      },
      relations: {
        offers: true,
      },
    });

    return wishes.map((wish) => plainToClass(WishDto, wish));
  }

  async findManyOne(id: FindManyOptions<WishDto>) {
    return this.wishRepository.find(id);
  }

  async copy(id: number, userId: number) {
    const wish = await this.wishRepository.findOneBy({ id });

    const copied = await this.wishRepository.find({
      where: {
        originalId: id,
        ownerId: userId,
      },
    });

    if (copied.length > 0) {
      throw new ForbiddenException('Вы уже копировали этот подарок');
    }

    if (wish.ownerId === userId) {
      throw new ForbiddenException('Нельзя копировать свой подарок');
    }

    await this.wishRepository.save({
      ...wish,
      id: null,
      ownerId: userId,
      offers: [],
      originalId: id,
    });

    await this.wishRepository.update({ id }, { copied: wish.copied + 1 });

    return {};
  }

  async update(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.wishRepository.findOneBy({ id });

    if (wish.ownerId !== userId) {
      throw new BadRequestException('Нельзя редактировать чужие подарки');
    }

    if (wish.offers?.length > 0) {
      throw new BadRequestException(
        'Нельзя редактировать подарок, если пользователи уже скинулись на него',
      );
    }

    await this.wishRepository.update(
      { id },
      { ...updateWishDto, updatedAt: new Date() },
    );

    return {};
  }

  async remove(id: number, userId: number): Promise<WishDto> {
    const wish = await this.wishRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        offers: true,
      },
    });

    delete wish.owner.email;

    if (wish.ownerId !== userId) {
      throw new BadRequestException('Нельзя удалять чужие подарки');
    }

    await this.wishRepository.delete({ id });

    return plainToClass(WishDto, wish);
  }
}
