import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Transaction } from '@prisma/client';
import { TransferPointsDto } from './dto/transfer-points.dto';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('transfer')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'P2P Transfer: переказ балів від одного користувача до іншого',
    description:
      'Виконує атомарну операцію: списує amount з балансу відправника, ' +
      'зараховує на баланс отримувача (у межах одного merchant) ' +
      'та створює запис у журналі транзакцій із типом TRANSFER.',
  })
  @ApiCreatedResponse({ description: 'Транзакція успішно створена' })
  @ApiBadRequestResponse({
    description: 'Невалідне тіло запиту (наприклад, amount <= 0)',
  })
  async transfer(@Body() dto: TransferPointsDto): Promise<Transaction> {
    return this.transactionsService.transfer(dto);
  }
}
