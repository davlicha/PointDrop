import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/transactions/earn (POST) - fails without payload', () => {
    return request(app.getHttpServer())
      .post('/transactions/earn')
      .send({ merchantId: 'some-uuid', amountSpent: 100 })
      .expect(400); // Bad Request due to validation
  });

  it('/api/v1/transactions/transfer (POST) - fails without auth token', () => {
    return request(app.getHttpServer())
      .post('/transactions/transfer')
      .send({
        amount: 50,
        merchantId: 'some-uuid',
        senderId: 'user-uuid',
        receiverPhone: '+380501234567'
      })
      .expect(401); // Unauthorized
  });
});
