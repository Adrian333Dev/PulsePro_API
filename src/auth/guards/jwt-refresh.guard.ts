import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JWT_REFRESH_STRATEGY_KEY } from '../constants';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(JWT_REFRESH_STRATEGY_KEY) {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as boolean;
  }

  override handleRequest<IJwtToken>(
    err: unknown,
    user: IJwtToken,
    info: unknown,
    context: ExecutionContext,
    status?: unknown,
  ): IJwtToken {
    const req = context.switchToHttp().getRequest();
    if (err || !user) throw new UnauthorizedException();
    return user;
  }
}


