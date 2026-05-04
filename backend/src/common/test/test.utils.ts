/**
 * Test utilities and helpers for backend tests
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

/**
 * Creates a test NestJS application module
 */
export async function createTestApp(
  imports?: any[],
  providers?: any[],
): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: imports || [],
    providers: providers || [],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  return app;
}

/**
 * Mock data generators for tests
 */
export const generateMockUser = (overrides = {}) => ({
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'test@example.com',
  phone: '+380961234567',
  name: 'Test User',
  passwordHash: 'hashedPassword123',
  role: 'CUSTOMER',
  createdAt: new Date(),
  ...overrides,
});

export const generateMockJwt = (payload = {}, expiresIn = '1d') => ({
  access_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJyb2xlIjoiQ1VTVE9NRVIifQ.test',
  payload,
  expiresIn,
});

export const generateMockQrPayload = () => ({
  qr_payload:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwidGltZXN0YW1wIjoxNjk0NzgyODM2MDY3LCJpYXQiOjE2OTQ3ODI4MzYsImV4cCI6MTY5NDc4MzA4N30.test',
});

/**
 * Cleans up test resources
 */
export async function cleanupTest(app: INestApplication) {
  if (app) {
    await app.close();
  }
}

/**
 * Waits for a specific amount of time in tests
 */
export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
