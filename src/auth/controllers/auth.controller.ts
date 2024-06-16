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
import { User } from '@prisma/client';

import { AuthService } from '@/auth/services';
import { ActiveUser, Auth } from '@/auth/decorators';
import { IAccessTokenPayload, IUserProfile, ITokens } from '@/auth/interfaces';
import { AuthType } from '@/auth/enums';
import { SignInInput, SignUpInput } from '@/auth/dto';
import { AUTH_ROUTES, AUTH_URL } from '@/auth/constants';

@Auth(AuthType.None)
@Controller(AUTH_URL)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post(AUTH_ROUTES.SIGN_UP)
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() user: SignUpInput): Promise<boolean> {
    return this.authService.signUp(user);
  }

  @Post(AUTH_ROUTES.SIGN_IN)
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() user: SignInInput): Promise<ITokens> {
    return this.authService.signIn(user);
  }

  @Auth(AuthType.RefreshToken)
  @Post(AUTH_ROUTES.REFRESH)
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@ActiveUser() user: User): Promise<ITokens> {
    return this.authService.refreshTokens(user);
  }

  @Auth(AuthType.AccessToken)
  @Get(AUTH_ROUTES.ME)
  @HttpCode(HttpStatus.OK)
  async me(@ActiveUser('sub') userId: number): Promise<IUserProfile> {
    return this.authService.getUserProfile(userId);
  }
}
