import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PrismaService } from '@/prisma';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';

import { SignUpInput, SignInInput } from '@/auth/dto';
import { jwtConfig } from '@/auth/config';
import { IAccessTokenPayload, ITokens, IUserProfile } from '@/auth/interfaces';
import { throwInvalidCreds } from '@/auth/utils';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY) private config: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async signUp(data: SignUpInput): Promise<boolean> {
    const hashedPassword = await argon2.hash(data.password);
    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
    return !!user;
  }

  async signIn({ password, email }: SignInInput): Promise<ITokens> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await argon2.verify(user.password, password)))
      throwInvalidCreds();
    return this.generateTokens({ userId: user.userId, email });
  }

  async generateTokens({
    userId,
    email,
  }: IAccessTokenPayload): Promise<ITokens> {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<IAccessTokenPayload>>(
        userId,
        this.config.accessTokenTtl,
        {
          email,
        },
      ),
      this.signToken(userId, this.config.refreshTokenTtl, { refreshTokenId }),
    ]);
    await this.refreshTokenIdsStorage.insert(userId, refreshTokenId);
    return { accessToken, refreshToken };
  }

  async refreshTokens(user: IAccessTokenPayload): Promise<ITokens> {
    await this.refreshTokenIdsStorage.invalidate(user.userId);
    return this.generateTokens(user);
  }

  async getUserProfile(userId: number): Promise<IUserProfile> {
    return this.prisma.user.findUnique({
      where: { userId },
      include: {
        employeeProfiles: {
          select: {
            empId: true,
            org: { select: { orgId: true, name: true } },
            role: true,
          },
        },
      },
    });
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      { userId, ...payload } as T & IAccessTokenPayload,
      {
        audience: this.config.audience,
        issuer: this.config.issuer,
        secret: this.config.secret,
        expiresIn,
      },
    );
  }
}
