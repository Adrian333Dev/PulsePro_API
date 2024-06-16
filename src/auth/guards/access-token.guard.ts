import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { jwtConfig } from '@/auth/config';
import { REQUEST_USER_KEY } from '@/auth/constants';
import { extractTokenFromHeader } from '@/auth/utils';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  private readonly logger = new Logger(AccessTokenGuard.name);
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Access token not provided');
    this.logger.log(`Access token: ${token}`);
    try {
      this.logger.log(`Config: ${JSON.stringify(this.config)}`);
      const payload = await this.jwtService.verifyAsync(token, this.config);
      this.logger.log(`Payload: ${JSON.stringify(payload)}`);
      request[REQUEST_USER_KEY] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
