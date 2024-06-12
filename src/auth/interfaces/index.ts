import { User, Employee, Prisma } from '@prisma/client';

export interface IEmployeeProfile
  extends Pick<Employee, 'empId' | 'orgId' | 'role'> {}

export interface IJWTPayload {
  userId: number;
  email: string;
}

export interface IUserOutput extends Omit<User, 'password' | 'refreshToken'> {}

// export interface IRefreshTokenPayload extends IJWTPayload {
//   refreshTokenId: string;
// }

export interface IUserWithEmployeeProfiles
  extends Pick<
    Prisma.UserGetPayload<{
      include: {
        employeeProfiles: { select: { empId: true; orgId: true; role: true } };
      };
    }>,
    'userId' | 'email' | 'employeeProfiles'
  > {}

export interface IGenerateTokensParams {
  userId: number;
  email: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
