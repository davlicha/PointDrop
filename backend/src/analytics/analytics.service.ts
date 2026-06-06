import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getSummary(merchantId: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id: merchantId },
    });
    
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalCustomers, issuedPointsResult, redeemedPointsResult] = await Promise.all([
      // Кількість унікальних клієнтів (баланси)
      this.prisma.balance.count({
        where: { merchantId },
      }),
      // Видані бали за місяць
      this.prisma.transaction.aggregate({
        where: {
          merchantId,
          type: 'EARN',
          timestamp: { gte: monthStart },
        },
        _sum: { amount: true },
      }),
      // Списані бали за місяць
      this.prisma.transaction.aggregate({
        where: {
          merchantId,
          type: 'REDEEM',
          timestamp: { gte: monthStart },
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalCustomers,
      pointsIssued: issuedPointsResult._sum.amount || 0,
      pointsRedeemed: redeemedPointsResult._sum.amount || 0,
    };
  }

  async getTransactions(merchantId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { merchantId },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
        include: {
          receiver: {
            select: { id: true, name: true, phone: true }
          },
        },
      }),
      this.prisma.transaction.count({
        where: { merchantId },
      }),
    ]);

    return {
      data: transactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
