import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

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
}
