import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from '@/auth/services';
import { JwtPayload, Public } from '@/auth/decorators';
import { IJWTPayload, IUserOutput } from '@/auth/interfaces';
import { JwtRefreshGuard } from '@/auth/guards';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
}
