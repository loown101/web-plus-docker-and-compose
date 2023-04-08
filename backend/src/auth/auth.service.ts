import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: LoginAuthDto): Promise<boolean> {
    const password = await this.usersService.getUserPassword(login.username);

    const IsCheckPassword = await bcrypt.compare(login.password, password);

    if (password && IsCheckPassword) {
      return true;
    }

    return false;
  }

  async login(login: LoginAuthDto): Promise<AuthDto> {
    const result = await this.validateUser(login);

    if (!result) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findUserName(login.username);

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.SECRET_KEY || 'secretKey',
        expiresIn: '7d',
      }),
    };
  }
}
