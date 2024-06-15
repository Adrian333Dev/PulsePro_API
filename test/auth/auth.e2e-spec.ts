import { HttpAdapterHost } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

import { AuthModule } from '@/auth';
import { PrismaModule, PrismaService } from '@/prisma';

/**
 * Auth Endpoints:
 * - POST /api/auth/register - Create a new organization and employee, and assign the employee to the organization
 *   - REQUEST: {email, password, orgName}
 *   - RESPONSE: true
 * - POST /api/auth/login - Login an employee and return access and refresh tokens
 *  - REQUEST: {email, password}
 *  - RESPONSE: {accessToken, refreshToken}
 * - POST /api/auth/refresh - Refresh access token
 *  - AUTHORIZATION: Bearer refreshToken
 *  - RESPONSE: {accessToken, refreshToken}
 * - GET /api/auth/me - Get employee profile
 *  - AUTHORIZATION: Bearer accessToken
 *  - RESPONSE: {id, name, email, org: {orgId, name}}
 */

const mockUser1 = {
  name: 'John Doe',
  email: 'john.doe@gmail.com',
  password: 'password123',
  orgName: 'Test Org',
};

describe('[Feature] Auth - api/auth', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let module: TestingModule;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), PrismaModule, AuthModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    prismaService = module.get<PrismaService>(PrismaService);

    await app.init();
  });

  describe('POST /register', () => {
    const validRegisterInput = { ...mockUser1 };

    const ENDPOINT = '/api/auth/register';
    it('should fail with invalid email', async () => {
      return await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...validRegisterInput, email: 'invalid-email' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail with invalid password', async () => {
      return await request(app.getHttpServer())
        .post(ENDPOINT)
        .send({ ...validRegisterInput, password: 'short' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail with invalid orgName', async () => {
      return await request(app.getHttpServer())
        .post(ENDPOINT)
        .send({ ...validRegisterInput, orgName: 'a' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should succeed', async () => {
      return await request(app.getHttpServer())
        .post(ENDPOINT)
        .send(validRegisterInput)
        .expect(HttpStatus.CREATED);
    });

    it('should fail with duplicate email', async () => {
      return await request(app.getHttpServer())
        .post(ENDPOINT)
        .send(validRegisterInput)
        .expect(HttpStatus.CONFLICT);
    });
  });

  describe('POST /login', () => {
    const validLoginInput = {
      email: mockUser1.email,
      password: mockUser1.password,
    };

    const ENDPOINT = '/api/auth/login';
    it('should fail with invalid email', async () => {
      return await request(app.getHttpServer())
        .post(ENDPOINT)
        .send({ ...validLoginInput, email: 'invalid-email' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail with invalid password', async () => {
      return await request(app.getHttpServer())
        .post(ENDPOINT)
        .send({ ...validLoginInput, password: 'short' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail with non-existent email', async () => {
      return await request(app.getHttpServer())
        .post(ENDPOINT)
        .send({ ...validLoginInput, email: 'nonexistingemail@gmail.com' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should fail with incorrect password', async () => {
      return await request(app.getHttpServer())
        .post(ENDPOINT)
        .send({ ...validLoginInput, password: 'incorrectpassword' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should succeed', async () => {
      const response = await request(app.getHttpServer())
        .post(ENDPOINT)
        .send(validLoginInput)
        .expect(HttpStatus.OK);

      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
      expect(typeof response.body.accessToken).toBe('string');
      expect(typeof response.body.refreshToken).toBe('string');

      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });
  });

  afterAll(async () => {
    // Clean up database
    await prismaService.employee.deleteMany();
    await prismaService.organization.deleteMany();

    await prismaService.$disconnect();
    await module.close();
    await app.close();
  });
});
