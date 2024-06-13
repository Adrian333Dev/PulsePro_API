import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { AuthService } from '@/auth/services';
import { ActiveUser, Auth } from '@/auth/decorators';
import { IAccessTokenPayload, ITokens, IUserProfile } from '@/auth/interfaces';
import { AuthType } from '@/auth/enums';
import { SignInInput, SignUpInput } from '@/auth/dto';

@Auth(AuthType.None)
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() user: SignUpInput): Promise<boolean> {
    return this.authService.signUp(user);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() user: SignInInput): Promise<ITokens> {
    return this.authService.signIn(user);
  }

  @Auth(AuthType.RefreshToken)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @ActiveUser() user: IAccessTokenPayload,
  ): Promise<ITokens> {
    return this.authService.refreshTokens(user);
  }

  @Auth(AuthType.AccessToken)
  @Get('profile/:userId')
  @HttpCode(HttpStatus.OK)
  async profile(@Param('userId') userId: number): Promise<IUserProfile> {
    return this.authService.getUserProfile(userId);
  }
}
