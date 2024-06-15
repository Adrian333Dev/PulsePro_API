import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';

import { AuthService } from '@/auth/services';
import { ActiveEmployee, Auth } from '@/auth/decorators';
import {
  IAccessTokenPayload,
  IEmployeeProfile,
  ITokens,
} from '@/auth/interfaces';
import { AuthType } from '@/auth/enums';
import { SignInInput, SignUpInput } from '@/auth/dto';
import { Employee } from '@prisma/client';

@Auth(AuthType.None)
@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() employee: SignUpInput): Promise<boolean> {
    return this.authService.register(employee);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() employee: SignInInput): Promise<ITokens> {
    return this.authService.login(employee);
  }

  @Auth(AuthType.RefreshToken)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@ActiveEmployee() employee: Employee): Promise<ITokens> {
    return this.authService.refreshTokens(employee);
  }

  @Auth(AuthType.AccessToken)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(
    @ActiveEmployee('sub') empId: number,
  ): Promise<IEmployeeProfile> {
    return this.authService.getEmployeeProfile(empId);
  }
}
