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
  Res,
} from '@nestjs/common';
import { REFRESH_COOKIE_NAME, AuthService } from './auth.service';
import { CreateUsersDto } from '../users/dto/createUsers.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { USESR_DETAIL, User } from '../users/entity/user.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { SetCookiesInterceptor } from './set-cookies.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private configService: ConfigService) {}

  @Post('register')
  async register(@Body() registerDto: CreateUsersDto): Promise<any> {
    const newUser = await this.authService.registration(registerDto);
    
    if (!newUser) throw new HttpException('Email is already registered', HttpStatus.CONFLICT);
    return newUser;
  }

  @UseGuards(LocalAuthGuard)                    // Check user credentials
  @UseInterceptors(ClassSerializerInterceptor)  // Intercept response for serialization
  @UseInterceptors(SetCookiesInterceptor)       // Set auth cookies (access, refresh)
  @SerializeOptions({ groups: [USESR_DETAIL] }) // Serialize response (without 'password')
  @Post('login')
  async login(@Req() request: any): Promise<User> {
    return request.user;
  }

  @UseInterceptors(SetCookiesInterceptor)       // Set auth cookies (access, refresh)
  @Post('logout')
  logout(@Req() request: any): any {
    request.resetCookies = true; // Reset auth cookie after logout
    return 'OK';
  }
    
  @UseGuards(JwtAuthGuard) // Check user valid access token
  @Get('me')
  async getProfile(@Request() request: any): Promise<any> {
    console.log('inside');
    
    return request.user;
  }
  
  @UseGuards(JwtRefreshGuard)                // Check user valid refresh token
  @UseInterceptors(SetCookiesInterceptor)    // Set auth cookies (access, refresh)
  @Post('refresh')
  async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @Request() request: any
  ): Promise<any> {
    await this.authService.revokeRefreshToken(request.cookies[REFRESH_COOKIE_NAME]);
    
    return request.user;
  }
}
