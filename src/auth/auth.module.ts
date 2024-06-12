import { Module } from '@nestjs/common';
import { AuthService } from './services';
import { AuthController } from './controllers';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './config';
@Module({
  imports: [JwtModule.registerAsync(jwtConfig.asProvider())],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
