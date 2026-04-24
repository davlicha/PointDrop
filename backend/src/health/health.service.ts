import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface HealthStatus {
  status: 'ok';
  db: 'up';
  uptime: number;
  timestamp: string;
}

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check(): Promise<HealthStatus> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      throw new ServiceUnavailableException({
        status: 'error',
        db: 'down',
        reason: error instanceof Error ? error.message : 'Unknown DB error',
      });
    }

    return {
      status: 'ok',
      db: 'up',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
