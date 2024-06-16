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
import { REQUEST_USER_KEY } from '@/auth/constants';
import { extractTokenFromHeader, throwInvalidToken } from '@/auth/utils';
import { IRefreshTokenPayload } from '@/auth/interfaces';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
    private readonly prisma: PrismaService,
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
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { userId: sub },
        include: { org: true, refreshToken: true },
      });
      const isValid = user.refreshToken.tokenId === refreshTokenId;
      if (isValid) throwInvalidToken('Refresh');
      request[REQUEST_USER_KEY] = user;
      return true;
    } catch {
      throwInvalidToken('Refresh');
    }
  }
}
