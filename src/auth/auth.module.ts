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

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env`, load: [config] }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10m' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, HashService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}