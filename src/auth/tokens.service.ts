import { RedisService } from "@liaoliaots/nestjs-redis";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import Redis from "ioredis";

export interface ITokenPayload {
  id: number
}

@Injectable()
export class AuthToken {
  private readonly redis: Redis;
  
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly redisService: RedisService
  ) {
    this.redis = this.redisService.getClient();
  }
  
  async isRefreshTokenRejected(token: string): Promise<string | null> {
    return await this.redis.get(token);
  }
  
  async rejectRefreshToken(token: string): Promise<'OK'> {
    // Remove from DB after 48h
    return await this.redis.setex(token, this.configService.get('jwtRefreshExpirationDb'), 'true');
  }

  accessToken(payload: ITokenPayload): string {
    return this.jwtService.sign(
      payload,
      {
        secret: this.configService.get('jwtAccessSecret'),
        expiresIn: `${this.configService.get('jwtAccessExpiration')}ms`, // Expire 15m
      },
    );
  }
  
  refreshToken(payload: ITokenPayload): string {
    return this.jwtService.sign(
      payload,
      {
        secret: this.configService.get('jwtRefreshSecret'),
        expiresIn: `${this.configService.get('jwtRefreshExpiration')}ms`, // Expire 48h
      },
    );
  }
}
