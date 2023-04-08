import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUserDto, UpdateUserDto, UserDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common/decorators';
import { WishesService } from '../wishes/wishes.service';
import { WishDto } from 'src/wishes/dto/wish.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishService: WishesService,
  ) {}

  @Get('me')
  @ApiOkResponse({ type: () => UserDto })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  findOne(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  @ApiOkResponse({ type: () => UserDto })
  @ApiBadRequestResponse({
    description: 'Ошибка валидации переданных значений',
  })
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  //не используется
  // @Delete(':id')
  // @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }

  @Get(':username')
  @ApiOkResponse({ type: () => UserDto })
  @ApiNotFoundResponse({ description: 'Пользователь не найден' })
  findUserName(@Param('username') username: string) {
    return this.usersService.findUserName(username);
  }

  @Post('find')
  @ApiCreatedResponse({ isArray: true, type: () => UserDto })
  find(@Body() data: FindUserDto) {
    return this.usersService.findMany(data.query);
  }

  @Get('me/wishes')
  @ApiOkResponse({ isArray: true, type: () => WishDto })
  findMyWishes(@Request() req) {
    return this.wishService.findMany(req.user.id);
  }

  @Get(':username/wishes')
  @ApiOkResponse({ type: () => WishDto })
  async findUserWishes(@Param('username') username: string) {
    const user = await this.usersService.findUserName(username);
    return await this.wishService.findMany(user.id);
  }
}
