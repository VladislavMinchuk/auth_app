import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from '../auth.service';

// No access if user has AUTH_COOKIE and REFRESH_COOKIE
@Injectable()
export class NonLoggedGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return !(request.cookies[AUTH_COOKIE_NAME] && request.cookies[REFRESH_COOKIE_NAME]);
  }
}