import { ConfigModule } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AuthModule } from '@/auth';
import { PrismaModule, PrismaService } from '@/prisma';
import { validationPipeOptions } from '@/main';

describe('[Feature] Auth - /auth', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), PrismaModule, AuthModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
    prismaService = module.get<PrismaService>(PrismaService);

    await app.init();
  });

  it('POST /api/auth/signup - invalid credentials', async () => {
    return request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({ email: 'invalid', password: 'short' })
      .expect(400);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await module.close();
    await app.close();
  });
});
