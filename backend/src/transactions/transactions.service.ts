import { Injectable, Logger } from '@nestjs/common';
import { Transaction, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TransferPointsDto } from './dto/transfer-points.dto';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async transfer(dto: TransferPointsDto): Promise<Transaction> {
    this.logger.log(
      `Transfer requested: sender=${dto.senderId} → ${dto.receiverPhone}, merchant=${dto.merchantId}, amount=${dto.amount}`,
    );

    return this.prisma.$transaction(async (tx) => {
      const receiver = await tx.user.findUniqueOrThrow({
        where: { phone: dto.receiverPhone },
        select: { id: true },
      });

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
}
