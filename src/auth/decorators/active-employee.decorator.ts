import { ExecutionContext, createParamDecorator } from "@nestjs/common";

import { REQUEST_EMPLOYEE_KEY } from "@/auth/constants";
import { IAccessTokenPayload } from "@/auth/interfaces";

export const ActiveEmployee = createParamDecorator(
  (field: keyof IAccessTokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const employee: IAccessTokenPayload | undefined = request[REQUEST_EMPLOYEE_KEY];
    return field ? employee?.[field] : employee;
  },
);
