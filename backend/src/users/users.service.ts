import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const users = await this.userRepository.find({
      where: [
        {
          email: createUserDto.email,
        },
        {
          username: createUserDto.username,
        },
      ],
    });

    if (users.length > 0) {
      throw new BadRequestException('Пользователь уже существует');
    }

    //хэширование из библиотики bcrypt

    const hash = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.userRepository.create({
      ...createUserDto,
      password: hash,
    });

    const user = await this.userRepository.save(newUser);

    return plainToClass(UserDto, user);
  }

  async findOne(id: number): Promise<UserDto> {
    // все методы должны принимать query-фильтр
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // вернуть без пароля
    return plainToClass(UserDto, user);
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    // если поменяется пароль, то нужно изменить hash

    if (updateUserDto.password) {
      const hash = await bcrypt.hash(updateUserDto.password, 10);

      await this.userRepository.update(
        { id },
        { ...updateUserDto, password: hash },
      );
    } else {
      try {
        await this.userRepository.update({ id }, { ...updateUserDto });
      } catch (err) {
        throw new ConflictException(
          'Данная почта или логин уже используются другим пользователем',
        );
      }
    }

    const user = this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return plainToClass(UserDto, user);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.userRepository.delete({ id });
  }

  async findMany(login: string): Promise<UserDto[]> {
    const users = await this.userRepository.find({
      where: [
        {
          email: Like(`%${login}%`),
        },
        {
          username: Like(`%${login}%`),
        },
      ],
    });

    return users.map((user) => plainToClass(UserDto, user));
  }

  async getUserPassword(username: string): Promise<string> {
    const user = await this.userRepository.findOneBy({ username: username });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.password;
  }

  async findUserName(username: string): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ username: username });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    delete user.email;

    return plainToClass(UserDto, user);
  }
}
