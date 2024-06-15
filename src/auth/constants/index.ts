import { Prisma } from '@prisma/client';

export const REQUEST_EMPLOYEE_KEY = 'employee';
export const JWT_KEY = 'jwt';


export const employeeProfileQuery: Prisma.EmployeeSelect = {
  empId: true,
  email: true,
  role: true,
  org: true,
};
