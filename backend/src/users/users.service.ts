import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async searchUsers(phoneQuery: string, merchantId: string) {
    const users = await this.prisma.user.findMany({
      where: {
        phone: {
          contains: phoneQuery,
        },
        balances: {
          some: {
            merchantId: merchantId,
          },
        },
        role: 'CUSTOMER', // Optionally filter to only CUSTOMER role
      },
      select: {
        id: true,
        name: true,
        phone: true,
      },
      take: 10,
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      phone: this.maskPhone(user.phone),
    }));
  }

  private maskPhone(phone: string): string {
    if (!phone || phone.length < 6) return phone;
    const prefix = phone.slice(0, 6);
    const suffix = phone.slice(-4);
    const maskedLength = Math.max(0, phone.length - 10);
    return `${prefix}${'*'.repeat(maskedLength)}${suffix}`;
  }

  async makeUserMerchant(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.update({
      where: { id: userId },
      data: { role: Role.ADMIN },
    });

    const existingMerchant = await this.prisma.merchant.findFirst({
      where: { adminId: userId },
    });

    if (!existingMerchant) {
      const merchantName = `Заклад ${user.name}`;
      await this.prisma.merchant.create({
        data: {
          name: merchantName,
          cashbackRate: 10.0,
          adminId: userId,
        },
      });
    }

    return { success: true, message: 'Тепер ви мерчант!' };
  }

  async getMerchantUsers(merchantId: string) {
    const users = await this.prisma.user.findMany({
      // Fetch all users in the system so admin can assign roles or balances to new users
      where: {},
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        balances: {
          where: { merchantId },
          select: { pointsAmount: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(user => ({
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      balance: user.balances[0]?.pointsAmount || 0,
    }));
  }

  async updateUserRole(adminId: string, targetUserId: string, newRole: Role) {
    // Впевняємося, що адмін є адміном
    const admin = await this.prisma.user.findUnique({
      where: { id: adminId },
      include: { managedMerchants: true }
    });
    
    if (!admin || admin.role !== Role.ADMIN) {
      throw new NotFoundException('Permission denied');
    }

    const merchantId = admin.managedMerchants[0]?.id;

    // Якщо призначаємо касиром, прив'язуємо до закладу адміна
    const updateData: any = { role: newRole };
    if (newRole === Role.CASHIER) {
      updateData.employerId = merchantId;
    } else if (newRole === Role.CUSTOMER) {
      updateData.employerId = null;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: targetUserId },
      data: updateData,
    });

    return { success: true, role: updatedUser.role };
  }

  async updateUserBalance(adminId: string, targetUserId: string, merchantId: string, newBalance: number) {
    // Впевняємося, що адмін є адміном закладу
    const merchant = await this.prisma.merchant.findUnique({ where: { id: merchantId } });
    if (!merchant || merchant.adminId !== adminId) {
      throw new NotFoundException('Permission denied');
    }

    const balance = await this.prisma.balance.findUnique({
      where: {
        userId_merchantId: {
          userId: targetUserId,
          merchantId,
        },
      },
    });

    const currentPoints = balance ? balance.pointsAmount : 0;
    const diff = newBalance - currentPoints;
    
    if (diff === 0) return { success: true, balance: newBalance };

    // Створюємо транзакцію для збереження історії
    await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          type: diff > 0 ? TransactionType.EARN : TransactionType.REDEEM,
          amount: Math.abs(diff),
          merchantId,
          receiverId: targetUserId,
          senderId: adminId,
        },
      }),
      this.prisma.balance.upsert({
        where: {
          userId_merchantId: {
            userId: targetUserId,
            merchantId,
          },
        },
        update: {
          pointsAmount: newBalance,
        },
        create: {
          userId: targetUserId,
          merchantId,
          pointsAmount: newBalance,
        },
      }),
    ]);

    return { success: true, balance: newBalance };
  }
}
