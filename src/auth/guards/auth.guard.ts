import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AUTH_TYPE_KEY } from '@/auth/decorators';
import { AuthType } from '@/auth/enums';
import { AccessTokenGuard } from './access-token.guard';
import { RefreshTokenGuard } from './refresh-token.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly refreshTokenGuard: RefreshTokenGuard,
  ) {}

  private static readonly defaultAuthType = AuthType.AccessToken;
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.AccessToken]: this.accessTokenGuard,
    [AuthType.RefreshToken]: this.refreshTokenGuard,
    [AuthType.None]: { canActivate: () => true },
  };



  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    let error = new UnauthorizedException();

    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => (error = err));
      if (canActivate) return true;
    }
    throw error;
  }
}
