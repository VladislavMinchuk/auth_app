import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUsersDto } from '../users/dto/createUsers.dto';
import { HashService } from './hash.service';
import { User } from 'users/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private hashService: HashService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    const userExist = user && await this.hashService.compareHash(pass, user?.password);
    
    if (userExist) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  
  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return { access_token: this.jwtService.sign(payload) };
  }
  
  async registration(userObject: CreateUsersDto): Promise<User | null> {
    const hasUser = await this.validateUser(userObject.email, userObject.password);
    // If user already exists    
    if (hasUser) return null;
    // Hash password and rewrite 'password' field
    userObject.password = await this.hashService.getHash(userObject.password);
    const user = await this.usersService.createUser(userObject);
    // Return new user
    return user;
  }
}