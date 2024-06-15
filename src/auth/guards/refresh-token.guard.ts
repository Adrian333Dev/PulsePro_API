import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma';

import { jwtConfig } from '@/auth/config';
import { REQUEST_EMPLOYEE_KEY } from '@/auth/constants';
import { extractTokenFromHeader, throwInvalidToken } from '@/auth/utils';
import { RefreshTokenIdsStorage } from '@/auth/services';
import { IRefreshTokenPayload } from '@/auth/interfaces';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly prisma: PrismaService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Refresh token not provided');
    try {
      const { sub, refreshTokenId } =
        await this.jwtService.verifyAsync<IRefreshTokenPayload>(
          token,
          this.config,
        );
      const employee = await this.prisma.employee.findUniqueOrThrow({
        where: { empId: sub },
      });
      const isValid = await this.refreshTokenIdsStorage.validate(
        employee.empId,
        refreshTokenId,
      );
      if (isValid) throwInvalidToken('Refresh');
      request[REQUEST_EMPLOYEE_KEY] = employee;
      return true;
    } catch {
      throwInvalidToken('Refresh');
    }
  }
}
