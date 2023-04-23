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
import { LocalAuthGuard } from './local-auth.guard';
import { USESR_DETAIL, User } from '../users/entity/user.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { SetCookiesInterceptor } from './set-cookies.interceptor';
import { RemoveCookiesInterceptor } from './remove-cookies.interceptor';
import { NonLoggedGuard } from './non-logged.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Only non-logged users
  @UseGuards(NonLoggedGuard)
  // Intercept response for serialization
  @UseInterceptors(ClassSerializerInterceptor)
  // Serialize response (without 'password')
  @SerializeOptions({ groups: [USESR_DETAIL] })
  @Post('register')
  async register(@Body() registerDto: CreateUsersDto): Promise<User> {
    const newUser: User = await this.authService.registration(registerDto);
    
    if (!newUser) throw new HttpException('Email is already registered', HttpStatus.CONFLICT);
    return newUser;
  }

  // Check user credentials
  @UseGuards(LocalAuthGuard)
  // Intercept response for serialization
  @UseInterceptors(ClassSerializerInterceptor)
  // Set auth cookies (access, refresh) after router handler
  @UseInterceptors(SetCookiesInterceptor)
  // Serialize response (without 'password')
  @SerializeOptions({ groups: [USESR_DETAIL] })
  @Post('login')
  async login(@Req() request: any): Promise<User> {
    return request.user;
  }
  
  // Remove auth cookies (access, refresh) after router handler
  @UseInterceptors(RemoveCookiesInterceptor)
  @Post('logout')
  logout(): any {
    return 'OK';
  }
  
  // Check user valid access token
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() request: any): Promise<any> {
    return request.user;
  }
  
  // Check user valid refresh token
  @UseGuards(JwtRefreshGuard)
  // Set auth cookies (access, refresh) after router handler
  @UseInterceptors(SetCookiesInterceptor)
  @Post('refresh')
  async refreshToken(@Request() request: any): Promise<any> {
    await this.authService.revokeRefreshToken(request.cookies[REFRESH_COOKIE_NAME]);
    
    return request.user;
  }
}
