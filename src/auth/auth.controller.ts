import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  HttpException,
  HttpStatus,
  Req,
  ClassSerializerInterceptor,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { REFRESH_COOKIE_NAME, AuthService } from './auth.service';
import { CreateUsersDto } from '../users/dto/createUsers.dto';
import { USESR_DETAIL, User } from '../users/entity/user.entity';
import { SetCookiesInterceptor, RemoveCookiesInterceptor } from './interceptor';
import { LocalAuthGuard, JwtAuthGuard, JwtRefreshGuard, NonLoggedGuard } from './guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(NonLoggedGuard) // Only non-logged users
  @UseInterceptors(ClassSerializerInterceptor) // Intercept response for serialization
  @SerializeOptions({ groups: [USESR_DETAIL] }) // Serialize response (without 'password')
  @Post('register')
  async register(@Body() registerDto: CreateUsersDto): Promise<User> {
    const newUser: User = await this.authService.registration(registerDto);
    
    if (!newUser) throw new HttpException('Email is already registered', HttpStatus.CONFLICT);
    return newUser;
  }

  @UseGuards(LocalAuthGuard) // Check user credentials
  @UseInterceptors(ClassSerializerInterceptor) // Intercept response for serialization
  @UseInterceptors(SetCookiesInterceptor) // Set auth cookies (access, refresh) after router handler
  @SerializeOptions({ groups: [USESR_DETAIL] }) // Serialize response (without 'password')
  @Post('login')
  async login(@Req() request: any): Promise<User> {
    return request.user;
  }
  
  @UseInterceptors(RemoveCookiesInterceptor) // Remove auth cookies (access, refresh) after router handler
  @Post('logout')
  logout(): any {
    return 'OK';
  }
  
  @UseGuards(JwtAuthGuard) // Check user valid access token
  @Get('me')
  async getProfile(@Request() request: any): Promise<any> {
    return request.user;
  }
  
  @UseGuards(JwtRefreshGuard) // Check user valid refresh token
  @UseInterceptors(SetCookiesInterceptor) // Set auth cookies (access, refresh) after router handler
  @Post('refresh')
  async refreshToken(@Request() request: any): Promise<any> {
    await this.authService.revokeRefreshToken(request.cookies[REFRESH_COOKIE_NAME]);
    
    return request.user;
  }
}
