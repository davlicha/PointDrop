import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService, HealthStatus } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Liveness probe + PostgreSQL connectivity check' })
  @ApiOkResponse({
    description: 'Service is healthy and DB is reachable',
    schema: {
      example: {
        status: 'ok',
        db: 'up',
        uptime: 12.34,
        timestamp: '2026-04-24T14:05:00.000Z',
      },
    },
  })
  check(): Promise<HealthStatus> {
    return this.health.check();
  }
}
