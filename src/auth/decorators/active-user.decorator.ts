import { ExecutionContext, createParamDecorator } from "@nestjs/common";

import { REQUEST_USER_KEY } from "@/auth/constants";
import { IAccessTokenPayload } from "@/auth/interfaces";

export const ActiveUser = createParamDecorator(
  (field: keyof IAccessTokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: IAccessTokenPayload | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
