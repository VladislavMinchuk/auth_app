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
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUsersDto } from '../users/dto/createUsers.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { USESR_DETAIL, User } from '../users/entity/user.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private configService: ConfigService) {}

  @Post('register')
  async register(@Body() registerDto: CreateUsersDto): Promise<any> {
    const newUser = await this.authService.registration(registerDto);
    
    if (!newUser) throw new HttpException('Email is already registered', HttpStatus.CONFLICT);
    return newUser;
  }

  @UseGuards(LocalAuthGuard) // Check user credentials
  @UseInterceptors(ClassSerializerInterceptor) // Intercept response for serialization
  @SerializeOptions({ groups: [USESR_DETAIL] }) // serialize response (without 'password')
  @Post('login')
  async login(
    @Res({ passthrough: true }) response: Response,
    @Req() request: any
  ): Promise<User> {
    const { authCookie, refreshCookie } = await this.authService.getAuthTokens(request.user);
    
    response.cookie('Authentication', authCookie, { httpOnly: true, maxAge: this.configService.get('jwtAccessExpiration') });
    response.cookie('Refresh', refreshCookie, { httpOnly: true, maxAge: this.configService.get('jwtRefreshExpiration') });
    
    return request.user;
  }
  
  @UseGuards(JwtAuthGuard) // Check user valid access token
  @Get('me')
  async getProfile(@Request() req): Promise<any> {
    return req.user;
  }
  
  @UseGuards(JwtRefreshGuard) // Check user valid refresh token
  @Get('refresh')
  async refreshToken(@Request() req): Promise<any> {
    return req.user;
  }
}
