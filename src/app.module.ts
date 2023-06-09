import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import config from './config';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { redisConfig } from './config/redis.config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env`, load: [config] }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    RedisModule.forRoot(redisConfig)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
