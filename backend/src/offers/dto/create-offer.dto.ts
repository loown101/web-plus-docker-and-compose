import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, Min } from 'class-validator';

export class CreateOfferDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty()
  @IsBoolean()
  hidden: boolean;

  @ApiProperty()
  @IsNumber()
  itemId: number;
}
