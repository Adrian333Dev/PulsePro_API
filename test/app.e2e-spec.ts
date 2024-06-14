import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';

/*
Here's endpoints I have to test:
POST /api/auth/signup - REQUEST: {email, password} - RESPONSE: true
POST /api/auth/signin - REQUEST: {email, password} - RESPONSE: {accessToken, refreshToken}
POST /api/auth/refresh - AUTHORIZATION: Bearer refreshToken - RESPONSE: {accessToken, refreshToken} - GUARD: refreshToken is valid
GET /api/auth/me - AUTHORIZATION: Bearer accessToken - RESPONSE: user - GUARD: accessToken is valid

Here's list of tests that need to run in order:
1. Test signup endpoint with invalid credentials (Can be more than one test)
2. Test signup endpoint with valid credentials
3. Test get me endpoint with invalid accessToken
4. Test refresh endpoint with invalid refreshToken
4. Test signin endpoint with invalid credentials (Can be more than one test)
5. Test signin endpoint with valid credentials (store accessToken and refreshToken for next tests)
6. Test get me endpoint with valid accessToken
7. Test refresh endpoint with valid refreshToken (store new accessToken and refreshToken for next tests)
*/

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => await app.close());
});
