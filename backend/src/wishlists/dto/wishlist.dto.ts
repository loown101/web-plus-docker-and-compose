import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { UserDto } from 'src/users/dto';
import { WishDto } from 'src/wishes/dto/wish.dto';

@Exclude()
export class WishListDto {
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
  @IsOptional()
  image: string;

  @Expose()
  @ApiProperty({ type: () => UserDto })
  owner: UserDto;

  @Expose()
  @ApiProperty({ type: () => WishDto, isArray: true })
  items: WishDto[];
}
