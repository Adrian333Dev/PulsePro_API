import { Prisma, UserRole } from '@prisma/client';

export interface IAccessTokenPayload {
  sub: number;
  email: string;
  role: UserRole;
}

export interface IUserProfile
  extends Omit<Prisma.UserGetPayload<{ include: { org: true } }>, 'password'> {}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshTokenPayload extends IAccessTokenPayload {
  refreshTokenId: string;
}

export interface ISignUpInput extends Omit<Prisma.UserCreateInput, 'org'> {
  orgName: string;
}
