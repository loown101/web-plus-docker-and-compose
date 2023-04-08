import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserDto } from 'src/users/dto';
import { WishDto } from 'src/wishes/dto/wish.dto';

@Exclude()
export class OfferDto {
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
  @ApiProperty({ type: () => WishDto })
  item: WishDto;

  @Expose()
  @ApiProperty()
  amount: number;

  @Expose()
  @ApiProperty()
  hidden: boolean;

  @Expose()
  @ApiProperty({ type: () => UserDto })
  user: UserDto;
}
