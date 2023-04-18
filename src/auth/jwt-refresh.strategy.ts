import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthToken } from './tokens.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private authToken: AuthToken) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Refresh;
      }]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true
    });
  }

  async validate(request: Request, payload: any) {
    // Check refresh token in Redis db
    const rejectedToken = await this.authToken.isRefreshTokenRejected(request.cookies?.Refresh || '');
    
    if (rejectedToken) return false;
    
    return { id: payload.id };
  }
}