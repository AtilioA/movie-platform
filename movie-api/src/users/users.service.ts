import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseService } from '../shared/services/base.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const users = await this.create(createUserDto);
    return users;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user || null;
  }
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.update(id, updateUserDto);
  }

  async findAll(options?: any): Promise<User[]> {
    const result = await super.findAll(options);
    return result as User[];
  }
}
