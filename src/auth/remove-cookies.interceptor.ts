import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { Response } from 'express';
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from './auth.service';

@Injectable()
export class RemoveCookiesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    return next.handle().pipe(
      tap(() => {
        response.cookie(AUTH_COOKIE_NAME, '',);
        response.cookie(REFRESH_COOKIE_NAME, '');
      }),
    );
  }
}
