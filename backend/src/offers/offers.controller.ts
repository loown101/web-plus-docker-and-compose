import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common/decorators';
import { OfferDto } from './dto/offer.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('offers')
@ApiTags('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @ApiOkResponse()
  async create(@Body() createOfferDto: CreateOfferDto, @Request() req) {
    return this.offersService.create(createOfferDto, req.user.id);
  }

  @Get()
  @ApiOkResponse({ isArray: true, type: () => OfferDto })
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: () => OfferDto })
  findOne(@Param('id') id: number) {
    return this.offersService.findOne(id);
  }
}
