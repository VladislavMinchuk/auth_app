import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUsersDto } from '../users/dto/createUsers.dto';
import { HashService } from './hash.service';

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
  
  async registration(dto: CreateUsersDto) {
    const hasUser = await this.validateUser(dto.email, dto.password);
    
    if (hasUser) {
      throw new HttpException('Email is already registered', HttpStatus.CONFLICT);
    }
    dto.password = await this.hashService.getHash(dto.password);
    const user = await this.usersService.createUser(dto);
    
    return user;
  }
}