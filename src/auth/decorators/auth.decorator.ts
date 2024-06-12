import { SetMetadata } from '@nestjs/common';
import { AuthType } from '@/auth/enums';

export const AUTH_TYPE_KEY = 'authType';

export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);

// Usage: @Auth(AuthType.ADMIN)