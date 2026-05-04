import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let healthService: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn(),
          } as any,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthService = module.get<HealthService>(HealthService);
  });

  describe('check', () => {
    it('should return healthy status', async () => {
      const mockHealthStatus = {
        status: 'ok',
        db: 'up',
        uptime: 100,
        timestamp: '2026-05-04T11:15:00.000Z',
      };

      jest.spyOn(healthService, 'check').mockResolvedValue(mockHealthStatus as any);

      const result = await controller.check();

      expect(result).toEqual(mockHealthStatus);
    });

    it('should call health service check method', async () => {
      const mockHealthStatus = {
        status: 'ok',
        db: 'up',
        uptime: 100,
        timestamp: '2026-05-04T11:15:00.000Z',
      };

      jest.spyOn(healthService, 'check').mockResolvedValue(mockHealthStatus as any);

      await controller.check();

      expect(healthService.check).toHaveBeenCalled();
    });
  });
});
