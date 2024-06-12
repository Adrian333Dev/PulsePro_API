import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { IJWTPayload } from '@/auth/interfaces';
import { jwtConfig } from '@/auth/config';
import { JWT_REFRESH_STRATEGY_KEY } from '@/auth/constants';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH_STRATEGY_KEY,
) {
  private readonly logger = new Logger(JwtRefreshStrategy.name);
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.secret,
    });
  }

  async validate(request: Request, payload: IJWTPayload) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    this.logger.debug(`Validating JWT refresh token payload: ${JSON.stringify(payload)}`);
    this.logger.debug(`Validating JWT refresh token: ${token}`);
    return payload;
  }
}
