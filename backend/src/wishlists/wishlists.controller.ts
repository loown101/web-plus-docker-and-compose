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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { WishListDto } from './dto/wishlist.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('wishlists')
@ApiTags('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @ApiOkResponse({ type: () => CreateWishlistDto })
  async create(@Body() createWishlistDto: CreateWishlistDto, @Request() req) {
    return await this.wishlistsService.create(createWishlistDto, req.user.id);
  }

  @Get()
  @ApiOkResponse({ isArray: true, type: () => WishListDto })
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: () => WishListDto })
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: () => WishListDto })
  update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Request() req,
  ) {
    return this.wishlistsService.update(id, updateWishlistDto, req.user.id);
  }

  @Delete(':id')
  @ApiOkResponse({ type: () => WishListDto })
  remove(@Param('id') id: number, @Request() req) {
    return this.wishlistsService.remove(id, req.user.id);
  }
}
