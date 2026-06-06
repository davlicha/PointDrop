import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiInternalServerErrorResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsSummaryDto, PaginatedTransactionsDto } from './dto';

@ApiTags('analytics')
@ApiInternalServerErrorResponse({ description: 'Внутрішня помилка сервера' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  @ApiOperation({
    summary: 'Отримати загальну аналітику',
    description: 'Повертає кількість клієнтів та суму виданих/списаних балів для мерчанта.',
  })
  @ApiOkResponse({ description: 'Аналітика успішно отримана', type: AnalyticsSummaryDto })
  @ApiBadRequestResponse({ description: 'Невалідні параметри запиту' })
  @ApiUnauthorizedResponse({ description: 'Токен авторизації невалідний або відсутній' })
  @ApiForbiddenResponse({ description: 'Доступ заборонено' })
  getSummary(@Query('merchantId') merchantId: string) {
    return this.analyticsService.getSummary(merchantId);
  }

  @Get('transactions')
  @ApiOperation({
    summary: 'Отримати список транзакцій',
    description: 'Повертає пагінований список транзакцій для мерчанта.',
  })
  @ApiOkResponse({ description: 'Список транзакцій успішно отримано', type: PaginatedTransactionsDto })
  @ApiBadRequestResponse({ description: 'Невалідні параметри запиту' })
  @ApiUnauthorizedResponse({ description: 'Токен авторизації невалідний або відсутній' })
  @ApiForbiddenResponse({ description: 'Доступ заборонено' })
  getTransactions(
    @Query('merchantId') merchantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.analyticsService.getTransactions(merchantId, page, limit);
  }
}
