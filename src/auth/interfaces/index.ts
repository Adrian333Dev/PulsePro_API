import { User, Organization, Employee, Prisma } from '@prisma/client';

export interface IEmployeeProfile
  extends Pick<Employee, 'empId' | 'orgId' | 'role'> {}

export interface IAccessTokenPayload {
  userId: number;
  email: string;
}

export interface IRefreshTokenPayload extends IAccessTokenPayload {
  refreshTokenId: string;
}

export interface IUserOutput extends Omit<User, 'password'> {}

export interface IUserWithEmployeeProfiles
  extends Pick<
    Prisma.UserGetPayload<{
      include: {
        employeeProfiles: { select: { empId: true; orgId: true; role: true } };
      };
    }>,
    'userId' | 'email' | 'employeeProfiles'
  > {}

// export interface IUserProfile
//   extends Omit<
//     Prisma.UserGetPayload<{
//       include: {
//         employeeProfiles: { select: { empId: true; orgId: true; role: true } };
//       };
//     }>,
//     'password'
//   > {}

// With Organization Details
export interface IUserProfile
  extends Omit<
    Prisma.UserGetPayload<{
      include: {
        employeeProfiles: { select: { empId: true; org: { select: { orgId: true; name: true } }; role: true } };
      };
    }>,
    'password'
  > {}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

const test: IUserWithEmployeeProfiles = {
  userId: 1,
  email: 'test',
  employeeProfiles: [],
};
