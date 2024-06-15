import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from '@/auth/controllers';
import { jwtConfig } from '@/auth/config';
import { RefreshTokenIdsStorage, AuthService } from '@/auth/services';
import {
  AccessTokenGuard,
  AuthGuardProvider,
  RefreshTokenGuard,
} from './guards';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    AuthService,
    // RefreshTokenIdsStorage,
    AccessTokenGuard,
    RefreshTokenGuard,
    AuthGuardProvider,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
