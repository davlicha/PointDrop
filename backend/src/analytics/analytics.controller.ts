import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  getSummary(@Query('merchantId') merchantId: string) {
    return this.analyticsService.getSummary(merchantId);
  }

  @Get('transactions')
  getTransactions(
    @Query('merchantId') merchantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.analyticsService.getTransactions(merchantId, page, limit);
  }
}
