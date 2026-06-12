import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsSummaryDto {
  @ApiProperty({ example: 120, description: 'Загальна кількість унікальних клієнтів закладу' })
  totalCustomers: number;

  @ApiProperty({ example: 1500, description: 'Кількість балів, виданих закладом' })
  pointsIssued: number;

  @ApiProperty({ example: 350, description: 'Кількість балів, списаних клієнтами' })
  pointsRedeemed: number;
}

export class AnalyticsReceiverDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', description: 'Унікальний ідентифікатор користувача' })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'Ім\'я користувача' })
  name: string;

  @ApiProperty({ example: '+380501234567', description: 'Номер телефону користувача' })
  phone: string;
}

export class AnalyticsTransactionItemDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', description: 'Унікальний ідентифікатор транзакції' })
  id: string;

  @ApiProperty({ example: 'EARN', description: 'Тип транзакції (EARN, REDEEM, TRANSFER)' })
  type: string;

  @ApiProperty({ example: 15, description: 'Кількість балів транзакції' })
  amount: number;

  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', description: 'ID закладу' })
  merchantId: string;

  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', description: 'ID відправника балів (якщо є)', required: false, nullable: true })
  senderId: string | null;

  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', description: 'ID отримувача балів' })
  receiverId: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z', description: 'Час створення транзакції' })
  timestamp: Date;

  @ApiProperty({ type: AnalyticsReceiverDto, description: 'Дані про користувача-отримувача' })
  receiver: AnalyticsReceiverDto;
}

export class PaginatedTransactionsDto {
  @ApiProperty({ type: [AnalyticsTransactionItemDto], description: 'Масив транзакцій для поточної сторінки' })
  data: AnalyticsTransactionItemDto[];

  @ApiProperty({ example: 150, description: 'Загальна кількість транзакцій' })
  total: number;

  @ApiProperty({ example: 1, description: 'Поточна сторінка' })
  page: number;

  @ApiProperty({ example: 50, description: 'Кількість елементів на сторінку' })
  limit: number;

  @ApiProperty({ example: 3, description: 'Загальна кількість сторінок' })
  totalPages: number;
}
