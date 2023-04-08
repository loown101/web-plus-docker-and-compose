import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common/decorators';
import { WishDto } from './dto/wish.dto';

@ApiBearerAuth()
@Controller('wishes')
@ApiTags('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOkResponse()
  create(@Body() createWishDto: CreateWishDto, @Request() req) {
    return this.wishesService.create(createWishDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({ isArray: true, type: () => WishDto })
  @ApiBadRequestResponse()
  findAll() {
    return this.wishesService.findAll();
  }

  @Get('top')
  @ApiOkResponse({ isArray: true, type: () => WishDto })
  findTop() {
    return this.wishesService.findTop();
  }

  @Get('last')
  @ApiOkResponse({ isArray: true, type: () => WishDto })
  findLast() {
    return this.wishesService.findLast();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({ type: () => WishDto })
  findOne(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOkResponse()
  update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Request() req,
  ) {
    return this.wishesService.update(id, req.user.id, updateWishDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOkResponse({ type: () => WishDto })
  remove(@Param('id') id: number, @Request() req) {
    return this.wishesService.remove(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  @ApiOkResponse()
  copy(@Param('id') id: number, @Request() req) {
    return this.wishesService.copy(id, req.user.id);
  }
}
