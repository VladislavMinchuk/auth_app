import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUsersDto } from '../users/dto/createUsers.dto';
import { HashService } from './hash.service';
import { User } from 'users/entity/user.entity';
import { AuthToken, ITokenPayload } from './tokens.service';

export interface IAuthTokens {
  authCookie: string,
  refreshCookie: string
}

export const AUTH_COOKIE_NAME = 'Authentication';
export const REFRESH_COOKIE_NAME = 'Refresh';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private hashService: HashService,
    private authToken: AuthToken
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    const userExist = user && await this.hashService.compareHash(pass, user?.password);
    
    if (userExist) return user;
    return null;
  }
  
  getAuthTokens(tokenPayload: ITokenPayload): IAuthTokens {
    return {
      authCookie: this.authToken.accessToken(tokenPayload),
      refreshCookie: this.authToken.refreshToken(tokenPayload)
    };
  }
  
  async revokeRefreshToken(token: string): Promise<void> {
    await this.authToken.rejectRefreshToken(token);
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