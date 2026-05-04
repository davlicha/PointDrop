import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class TransactionResponseDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id: string;

  @ApiProperty({ enum: TransactionType, example: 'EARN' })
  type: TransactionType;

  @ApiProperty({ example: 15, description: 'Кількість нарахованих/списаних балів' })
  amount: number;

  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  merchantId: string;

  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  receiverId: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  timestamp: Date;

  @ApiProperty({ example: 115, description: 'Поточний баланс після транзакції' })
  currentBalance: number;
}
