import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUrl,
  Length,
  Min,
  IsNumber,
  IsOptional,
} from 'class-validator';
export class CreateWishDto {
  @ApiProperty()
  @IsString()
  @Length(1, 250)
  name: string;

  @ApiProperty()
  @IsUrl()
  link: string;

  @ApiProperty()
  @IsUrl()
  image: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  price: number;

  @ApiProperty()
  @IsString()
  @Length(1, 1024)
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  raised: number;
}
