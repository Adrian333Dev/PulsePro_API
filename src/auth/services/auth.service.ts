import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { User, UserRole, Prisma } from '@prisma/client';

import { SignUpInput, SignInInput } from '@/auth/dto';
import { jwtConfig } from '@/auth/config';
import { IAccessTokenPayload, ITokens, IUserProfile } from '@/auth/interfaces';
import { throwInvalidCreds } from '@/auth/utils';
import { userProfileQuery } from '@/auth/constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY) private config: ConfigType<typeof jwtConfig>,
  ) {}

  async signUp({ orgName, password, ...data }: SignUpInput): Promise<boolean> {
    // TODO: Wrap this in a transaction
    const org = await this.prisma.org.create({
      data: { name: orgName },
    });

    const hashedPassword = await argon2.hash(password);
    const employee = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        orgId: org.orgId,
        role: UserRole.ADMIN,
      },
    });

    return !!employee;
  }

  async signIn({ password, email }: SignInInput): Promise<ITokens> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user || !(await argon2.verify(user.password, password)))
      throwInvalidCreds();
    return this.generateTokens(user);
  }

  async generateTokens({ userId, email, role }: User): Promise<ITokens> {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<IAccessTokenPayload>>(
        userId,
        this.config.accessTokenTtl,
        { email, role },
      ),
      this.signToken(userId, this.config.refreshTokenTtl, { refreshTokenId }),
    ]);
    await this.prisma.token.create({ data: { tokenId: refreshTokenId, userId } });
    return { accessToken, refreshToken };
  }

  async refreshTokens(user: User): Promise<ITokens> {
    await this.prisma.token.deleteMany({ where: { userId: user.userId } });
    return this.generateTokens(user);
  }

  async getUserProfile(userId: number): Promise<IUserProfile> {
    return this.prisma.user.findUnique({
      where: { userId },
      select: userProfileQuery,
    });
  }

  private async signToken<T>(empId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      { sub: empId, ...payload } as IAccessTokenPayload & T,
      {
        audience: this.config.audience,
        issuer: this.config.issuer,
        secret: this.config.secret,
        expiresIn,
      },
    );
  }
}
