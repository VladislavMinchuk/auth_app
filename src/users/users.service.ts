import { Injectable } from '@nestjs/common';
import { CreateUsersDto } from '../users/dto/createUsers.dto';
import { UserRepository } from './user.repository';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  
  async createUser(user: CreateUsersDto) {
    return await this.userRepository.createUser(user);
  }
  
  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }
  
  async findOneById(id: number): Promise<User> {
    return this.userRepository.findById(id);
  }
  
  findAll() {
    return this.userRepository.findAll();
  }
}