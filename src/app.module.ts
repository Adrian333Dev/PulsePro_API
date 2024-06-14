import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

import { AuthModule } from './auth/auth.module';
import {
  AccessTokenGuard,
  AuthGuardProvider,
  RefreshTokenGuard,
} from './auth/guards';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
