import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/user-create.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/user-update.dto';
import { selectUserDataDefault } from 'src/utils/queries/user-response-query';
import { UserAlreadyExistsException } from 'src/utils/exception/user-exists.exception';
import { EmailAlreadyExistsException } from 'src/utils/exception/email.exception';
import { NotFoundException } from 'src/utils/exception/not-found.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      select: selectUserDataDefault,
      where: {
        id: id,
      },
      relations: {
        wishes: true,
        offers: true,
        wishlists: true,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const name = await this.findByUsername(createUserDto.username);
    if (name) {
      throw new UserAlreadyExistsException();
    }

    const email = await this.findByEmail(createUserDto.email);
    if (email) {
      throw new EmailAlreadyExistsException();
    }
    const date = new Date();
    const passwordHash = await this.hashPassword(createUserDto.password);
    const user: User = this.usersRepository.create({
      ...createUserDto,
      password: passwordHash,
      createdAt: date,
      updatedAt: date,
    });

    return this.usersRepository.save(user);
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });

    return user;
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.email) {
      const email = await this.findByEmail(updateUserDto.email);
      if (email) {
        throw new EmailAlreadyExistsException();
      }
    }
    if (updateUserDto.username) {
      const username = await this.findByUsername(updateUserDto.username);
      if (username) {
        throw new UserAlreadyExistsException();
      }
    }
    let updatedData: UpdateUserDto = { ...updateUserDto };
    const currentDate: Date = new Date();
    if (updateUserDto.password) {
      const passwordHash = await this.hashPassword(updateUserDto.password);
      updatedData = { ...updateUserDto, password: passwordHash };
    }
    const updatedUser = { ...user, ...updatedData, updatedAt: currentDate };
    return this.usersRepository.save(updatedUser);
  }

  async findMany(query: string): Promise<User[]> {
    const user = await this.usersRepository.find({
      select: selectUserDataDefault,
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    const compare = await bcrypt.compare(password, hashPassword);
    return compare;
  }
}
