import { Controller, Post, Body } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from 'src/users/dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  @ApiOkResponse({ type: UserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    await this.authService.login({
      username: createUserDto.username,
      password: createUserDto.password,
    });

    return user;
  }

  //токен
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiOkResponse({ type: AuthDto })
  async login(@Body() user: LoginAuthDto) {
    return this.authService.login(user);
  }
}
