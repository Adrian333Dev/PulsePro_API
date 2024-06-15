import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { Employee, EmployeeRole, Prisma } from '@prisma/client';

import { SignUpInput, SignInInput } from '@/auth/dto';
import { jwtConfig } from '@/auth/config';
import {
  IAccessTokenPayload,
  ITokens,
  IEmployeeProfile,
} from '@/auth/interfaces';
import { throwInvalidCreds } from '@/auth/utils';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import { employeeProfileQuery } from '@/auth/constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY) private config: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}

  async register({
    orgName,
    password,
    ...data
  }: SignUpInput): Promise<boolean> {
    // TODO: Wrap this in a transaction
    const org = await this.prisma.organization.create({
      data: { name: orgName },
    });

    const hashedPassword = await argon2.hash(password);
    const employee = await this.prisma.employee.create({
      data: {
        ...data,
        password: hashedPassword,
        orgId: org.orgId,
        role: EmployeeRole.ADMIN,
      },
    });

    return !!employee;
  }

  async login({ password, email }: SignInInput): Promise<ITokens> {
    const employee = await this.prisma.employee.findUnique({
      where: { email },
    });
    if (!employee || !(await argon2.verify(employee.password, password)))
      throwInvalidCreds();
    return this.generateTokens(employee);
  }

  async generateTokens({ empId, email, role }: Employee): Promise<ITokens> {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<IAccessTokenPayload>>(
        empId,
        this.config.accessTokenTtl,
        { email, role },
      ),
      this.signToken(empId, this.config.refreshTokenTtl, { refreshTokenId }),
    ]);
    await this.refreshTokenIdsStorage.insert(empId, refreshTokenId);
    return { accessToken, refreshToken };
  }

  async refreshTokens(employee: Employee): Promise<ITokens> {
    await this.refreshTokenIdsStorage.invalidate(employee.empId);
    return this.generateTokens(employee);
  }

  async getEmployeeProfile(empId: number): Promise<IEmployeeProfile> {
    return this.prisma.employee.findUnique({
      where: { empId },
      select: employeeProfileQuery,
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
