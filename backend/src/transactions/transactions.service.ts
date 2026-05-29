import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Transaction, TransactionType } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { EarnPointsDto, RedeemPointsDto, TransferPointsDto } from './dto';

export interface TransactionResult {
  transaction: Transaction;
  currentBalance: number;
}

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async transfer(dto: TransferPointsDto): Promise<Transaction> {
    this.logger.log(
      `Transfer requested: sender=${dto.senderId} → ${dto.receiverPhone}, merchant=${dto.merchantId}, amount=${dto.amount}`,
    );

    return this.prisma.$transaction(async (tx) => {
      const receiver = await tx.user.findFirst({
        where: dto.receiverId ? { id: dto.receiverId } : { phone: dto.receiverPhone },
        select: { id: true },
      });

      if (!receiver) {
        throw new NotFoundException('Користувача з таким номером не знайдено');
      }

      if (receiver.id === dto.senderId) {
        throw new BadRequestException('Неможливо переказати бали самому собі');
      }

      const senderBalance = await tx.balance.findUnique({
        where: {
          userId_merchantId: {
            userId: dto.senderId,
            merchantId: dto.merchantId,
          },
        },
      });

      if (!senderBalance || senderBalance.pointsAmount < dto.amount) {
        throw new ConflictException('Недостатньо балів на балансі для переказу');
      }

      await tx.balance.update({
        where: {
          userId_merchantId: {
            userId: dto.senderId,
            merchantId: dto.merchantId,
          },
        },
        data: { pointsAmount: { decrement: dto.amount } },
      });

      await tx.balance.upsert({
        where: {
          userId_merchantId: {
            userId: receiver.id,
            merchantId: dto.merchantId,
          },
        },
        create: {
          userId: receiver.id,
          merchantId: dto.merchantId,
          pointsAmount: dto.amount,
        },
        update: { pointsAmount: { increment: dto.amount } },
      });

      const transaction = await tx.transaction.create({
        data: {
          type: TransactionType.TRANSFER,
          amount: dto.amount,
          merchantId: dto.merchantId,
          senderId: dto.senderId,
          receiverId: receiver.id,
        },
      });

      this.logger.log(`Transfer completed: transactionId=${transaction.id}`);
      return transaction;
    });
  }

  async earn(dto: EarnPointsDto): Promise<TransactionResult> {
    this.logger.log(
      `Earn requested: merchant=${dto.merchantId}, amountSpent=${dto.amountSpent}`,
    );

    // 1. Розшифровуємо QR payload та отримуємо userId
    const qrData = this.authService.verifyQrPayload(dto.qrPayload);
    const userId = qrData.user_id;

    this.logger.log(`QR payload verified for user: ${userId}`);

    // 2. Знаходимо мерчанта та отримуємо cashback_rate
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: dto.merchantId },
    });

    if (!merchant) {
      throw new NotFoundException(`Мерчант з ID ${dto.merchantId} не знайдений`);
    }

    // 3. Вираховуємо суму балів
    const earnedPoints = Math.floor(dto.amountSpent * (merchant.cashbackRate / 100));

    if (earnedPoints <= 0) {
      throw new BadRequestException('Сума покупки занадто мала для нарахування балів');
    }

    this.logger.log(
      `Calculating points: ${dto.amountSpent} * ${merchant.cashbackRate}% = ${earnedPoints} points`,
    );

    // 4. Атомарна транзакція: оновлюємо баланс + створюємо лог
    const result = await this.prisma.$transaction(async (tx) => {
      // Upsert балансу (створюємо якщо не існує, або оновлюємо)
      const balance = await tx.balance.upsert({
        where: {
          userId_merchantId: {
            userId,
            merchantId: dto.merchantId,
          },
        },
        create: {
          userId,
          merchantId: dto.merchantId,
          pointsAmount: earnedPoints,
        },
        update: {
          pointsAmount: { increment: earnedPoints },
        },
      });

      // Створюємо запис транзакції
      const transaction = await tx.transaction.create({
        data: {
          type: TransactionType.EARN,
          amount: earnedPoints,
          merchantId: dto.merchantId,
          receiverId: userId,
          // senderId null для EARN транзакцій
        },
      });

      return { transaction, currentBalance: balance.pointsAmount };
    });

    this.logger.log(
      `Earn completed: transactionId=${result.transaction.id}, earned=${earnedPoints}, newBalance=${result.currentBalance}`,
    );

    return result;
  }

  async redeem(dto: RedeemPointsDto): Promise<TransactionResult> {
    this.logger.log(
      `Redeem requested: user=${dto.userId}, merchant=${dto.merchantId}, points=${dto.requestedPoints}`,
    );

    // 1. Перевіряємо чи існує баланс та чи достатньо балів
    const balance = await this.prisma.balance.findUnique({
      where: {
        userId_merchantId: {
          userId: dto.userId,
          merchantId: dto.merchantId,
        },
      },
    });

    if (!balance) {
      throw new BadRequestException(
        'Баланс не знайдено для цього користувача та мерчанта',
      );
    }

    if (balance.pointsAmount < dto.requestedPoints) {
      throw new BadRequestException(
        `Недостатньо балів. Доступно: ${balance.pointsAmount}, запитано: ${dto.requestedPoints}`,
      );
    }

    // 2. Атомарна транзакція: списуємо бали + створюємо лог
    const result = await this.prisma.$transaction(async (tx) => {
      // Списуємо бали
      const updatedBalance = await tx.balance.update({
        where: {
          userId_merchantId: {
            userId: dto.userId,
            merchantId: dto.merchantId,
          },
        },
        data: {
          pointsAmount: { decrement: dto.requestedPoints },
        },
      });

      // Створюємо запис транзакції
      const transaction = await tx.transaction.create({
        data: {
          type: TransactionType.REDEEM,
          amount: dto.requestedPoints,
          merchantId: dto.merchantId,
          receiverId: dto.userId,
          // senderId null для REDEEM транзакцій
        },
      });

      return { transaction, currentBalance: updatedBalance.pointsAmount };
    });

    this.logger.log(
      `Redeem completed: transactionId=${result.transaction.id}, redeemed=${dto.requestedPoints}, newBalance=${result.currentBalance}`,
    );

    return result;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: { timestamp: 'desc' },
      take: 20,
    });
  }
}
