import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { OfferDto } from 'src/offers/dto/offer.dto';
import { UserDto } from 'src/users/dto';

@Exclude()
export class WishDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  link: string;

  @Expose()
  @ApiProperty()
  image: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  price: number;

  @Expose()
  @ApiProperty()
  raised: number;

  @Expose()
  @ApiProperty()
  copied: number;

  @Expose()
  @ApiProperty({ type: () => UserDto })
  owner: UserDto;

  @Expose()
  @ApiProperty({ type: () => OfferDto, isArray: true })
  offers: OfferDto[];
}
