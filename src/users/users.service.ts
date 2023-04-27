import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { CreateUsersDto } from '../users/dto/createUsers.dto';
import { UserRepository } from './user.repository';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  private readonly redis: Redis;

  constructor(private readonly userRepository: UserRepository) {}
  
  async createUser(user: CreateUsersDto): Promise<User> {
    return await this.userRepository.createUser(user);
  }
  
  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findByEmail(email);
  }
  
  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findById(id);
  }
  
  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}