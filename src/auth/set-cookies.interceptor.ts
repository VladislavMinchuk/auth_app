import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { Response } from 'express';
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME, AuthService } from './auth.service';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SetCookiesInterceptor implements NestInterceptor {
  constructor(private authService: AuthService, private configService: ConfigService) {}
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    
    return next.handle().pipe(
      tap(() => {
        const { authCookie, refreshCookie } = this.authService.getAuthTokens({ id: request.user.id });
        response.cookie(AUTH_COOKIE_NAME, authCookie, { httpOnly: true, maxAge: this.configService.get('jwtAccessExpiration') });
        response.cookie(REFRESH_COOKIE_NAME, refreshCookie, { httpOnly: true, maxAge: this.configService.get('jwtRefreshExpiration') });
      }),
    );
  }
}
