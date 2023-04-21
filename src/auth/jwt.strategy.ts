import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthToken } from './tokens.service';
import { AUTH_COOKIE_NAME } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authToken: AuthToken) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.[AUTH_COOKIE_NAME];
      }]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
      passReqToCallback: true
    });
  }

  async validate(request: Request, payload: any) {
    // console.log(request.cookies);
    // console.log(payload);
    // const rejectedToken = await this.authToken.isRefreshTokenRejected(request.cookies?.Refresh || '');
    
    // if (rejectedToken) return false;
    
    return { id: payload.id };
  }
}