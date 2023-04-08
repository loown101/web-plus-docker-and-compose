import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateWishlistDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  image: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  itemsId: number[];

  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsString()
  // description: string
}
