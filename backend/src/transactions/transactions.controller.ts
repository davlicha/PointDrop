import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Transaction } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  EarnPointsDto,
  RedeemPointsDto,
  TransactionResponseDto,
  TransferPointsDto,
} from './dto';
import { TransactionsService, TransactionResult } from './transactions.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('transfer')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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

  @Post('earn')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Нарахування балів (EARN)',
    description:
      'Розшифровує QR payload, обчислює бали на основі cashback_rate мерчанта ' +
      'та атомарно зараховує бали на баланс користувача.',
  })
  @ApiCreatedResponse({
    description: 'Бали успішно нараховано',
    type: TransactionResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'QR-код недійсний/прострочений або сума покупки некоректна',
  })
  @ApiNotFoundResponse({
    description: 'Мерчант не знайдений',
  })
  async earn(@Body() dto: EarnPointsDto): Promise<TransactionResponseDto> {
    const result = await this.transactionsService.earn(dto);
    return this.mapToResponse(result);
  }

  @Post('redeem')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Списання балів (REDEEM)',
    description:
      'Перевіряє достатність балів та атомарно списує їх з балансу користувача.',
  })
  @ApiCreatedResponse({
    description: 'Бали успішно списано',
    type: TransactionResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Недостатньо балів або баланс не знайдено',
  })
  @ApiUnauthorizedResponse({
    description: 'Токен авторизації невалідний або відсутній',
  })
  async redeem(@Body() dto: RedeemPointsDto): Promise<TransactionResponseDto> {
    const result = await this.transactionsService.redeem(dto);
    return this.mapToResponse(result);
  }

  private mapToResponse(result: TransactionResult): TransactionResponseDto {
    return {
      id: result.transaction.id,
      type: result.transaction.type,
      amount: result.transaction.amount,
      merchantId: result.transaction.merchantId,
      receiverId: result.transaction.receiverId,
      timestamp: result.transaction.timestamp,
      currentBalance: result.currentBalance,
    };
  }
}
