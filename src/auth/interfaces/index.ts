import { Organization, Employee, Prisma, EmployeeRole } from '@prisma/client';

export interface IAccessTokenPayload {
  sub: number;
  email: string;
  role: EmployeeRole;
}

export interface IEmployeeProfile
  extends Omit<
    Prisma.EmployeeGetPayload<{ include: { org: true } }>,
    'password'
  > {}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshTokenPayload extends IAccessTokenPayload {
  refreshTokenId: string;
}

export interface IRegisterInput extends Omit<Prisma.EmployeeCreateInput, 'org'> {
  orgName: string;
}

// employee: empId,
