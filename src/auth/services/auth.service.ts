import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';

import { SignUpInput, SignInInput } from '@/auth/dto';
import { jwtConfig } from '@/auth/config';
import {
  IJWTPayload,
  IUserOutput,
  IGenerateTokensParams,
  ITokens,
} from '@/auth/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY) private config: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp(data: SignUpInput): Promise<IUserOutput> {
    const hashedPassword = await argon2.hash(data.password);
    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    return { userId: user.userId, email: user.email };
  }

  async signIn(data: SignInInput): Promise<IUserOutput> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) throw new NotFoundException('Invalid credentials');
    const isPasswordValid = await argon2.verify(user.password, data.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');
    return { userId: user.userId, email: user.email };
  }

  async generateTokens(payload: IGenerateTokensParams): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.secret,
        expiresIn: this.config.accessTokenTtl,
      }),
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.config.refreshSecret,
          expiresIn: this.config.refreshTokenTtl,
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string): Promise<ITokens> {
    try {
      const { userId, email } = await this.jwtService.verifyAsync<IJWTPayload>(
        refreshToken,
        { secret: this.config.refreshSecret },
      );
      await this.validateUser(userId);
      return this.generateTokens({ userId, email: email });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(userId: number): Promise<IUserOutput> {
    const user = await this.prisma.user.findUnique({ where: { userId } });
    if (!user) throw new BadRequestException('User not found');
    return { userId: user.userId, email: user.email };
  }

  async signOut(userId: number): Promise<void> {
    await this.validateUser(userId);
    await this.prisma.user.update({
      where: { userId },
      data: { refreshToken: randomUUID() },
    });
  }

  async getProfile(userId: number): Promise<IUserOutput> {
    return this.validateUser(userId);
  }
}
