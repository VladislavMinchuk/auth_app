import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import config from '../config';
import { HashService } from './hash.service';
import { AuthToken } from './tokens.service';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env`, load: [config] }),
    JwtModule.register({}),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy, HashService, AuthToken],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}