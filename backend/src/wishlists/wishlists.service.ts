import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { WishesService } from 'src/wishes/wishes.service';
import { In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishListDto } from './dto/wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishListRepository: Repository<Wishlist>,
    private readonly wishService: WishesService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, userId: number) {
    //должен создаться при регистрации

    // const wishByOwner = wishes.map(wish => {
    //   if (wish.owner.id === userId) {
    //     return wish.id
    //   }
    // })

    //if (wishByOwner.length === 0) {
    //отрисовать пол-лю сообщение "Ваш список желаний пуст"
    //}

    const wishes = await this.wishService.findManyOne({
      where: {
        id: In(createWishlistDto.itemsId || []),
      },
    });

    // await Promise.all(createWishlistDto.itemsId.map(async id => {
    //   return await this.wishService.getWish(id)
    // }))

    const newWishList = await this.wishListRepository.save({
      ...createWishlistDto,
      ownerId: userId,
      items: wishes,
    });

    return plainToClass(WishListDto, newWishList);
  }

  async findAll(): Promise<WishListDto[]> {
    const wishlists = await this.wishListRepository.find({
      relations: {
        items: true,
      },
    });

    return wishlists.map((wishlist) => plainToClass(WishListDto, wishlist));
  }

  async findOne(id: number): Promise<WishListDto> {
    const wishlist = await this.getWishList(id);

    return plainToClass(WishListDto, wishlist);
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ): Promise<WishListDto> {
    const wishlist = await this.wishListRepository.findOneBy({ id });

    if (wishlist.ownerId !== userId) {
      throw new BadRequestException(
        'Нельзя редактировать чужой список желаний',
      );
    }

    const wishes = await this.wishService.findManyOne({
      where: {
        id: In(updateWishlistDto.itemsId || []),
      },
    });

    // const wishes = await Promise.all(updateWishlistDto.itemsId.map(async id => {
    //   return await this.wishService.getWish(id)
    // }))

    const updateWishList = await this.wishListRepository.save({
      ...updateWishlistDto,
      id: id,
      items: wishes,
    });

    updateWishList.owner = wishlist.owner;

    const newWishList = await this.getWishList(id);

    return plainToClass(WishListDto, newWishList);
  }

  async getWishList(id: number) {
    const newWishList = await this.wishListRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });

    return newWishList;
  }

  async remove(id: number, userId: number): Promise<WishListDto> {
    const newWishList = await this.getWishList(id);

    if (newWishList.ownerId !== userId) {
      throw new BadRequestException('Нельзя удалять чужой список желаний');
    }

    await this.wishListRepository.delete({ id });

    return plainToClass(WishListDto, newWishList);
  }
}
