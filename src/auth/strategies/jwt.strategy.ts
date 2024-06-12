import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { jwtConfig } from '@/auth/config';
import { JWT_STRATEGY_KEY } from '@/auth/constants';
import { IJWTPayload } from '@/auth/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY_KEY) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    @Inject(jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.secret,
    });
    this.logger.log(`JWT strategy initialized`);
  }

  async validate(payload: IJWTPayload) {
    this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);
    return payload;
  }
}
