import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import config from '../config';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthToken } from './tokens.service';
import { HashService } from './hash.service';
import { AuthController } from './auth.controller';
import { JwtStrategy, LocalStrategy, JwtRefreshStrategy } from './strategy';
import { SetCookiesInterceptor, RemoveCookiesInterceptor } from './interceptor';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env`, load: [config] }),
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    HashService,
    AuthToken,
    SetCookiesInterceptor,
    RemoveCookiesInterceptor
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}