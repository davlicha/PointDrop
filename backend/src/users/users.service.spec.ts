import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaMock: {
    user: { findMany: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
    merchant: { findFirst: jest.Mock; create: jest.Mock };
  };

  beforeEach(async () => {
    prismaMock = {
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      merchant: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchUsers', () => {
    it('should return masked phones for found users', async () => {
      const mockUsers = [
        { id: '1', name: 'Ivan', phone: '+380501234567' },
        { id: '2', name: 'Petro', phone: '+380509876543' },
      ];

      prismaMock.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.searchUsers('50123', 'merchant-123');

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        where: {
          phone: { contains: '50123' },
          balances: { some: { merchantId: 'merchant-123' } },
          role: 'CUSTOMER',
        },
        select: { id: true, name: true, phone: true },
        take: 10,
      });

      expect(result).toHaveLength(2);
      expect(result[0].phone).toBe('+38050***4567');
      expect(result[1].phone).toBe('+38050***6543');
    });

    it('should handle short phone numbers without masking completely', async () => {
      const mockUsers = [{ id: '1', name: 'Short', phone: '123' }];
      prismaMock.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.searchUsers('123', 'merchant-123');
      expect(result[0].phone).toBe('123');
    });
  });

  describe('makeUserMerchant', () => {
    const userId = 'user-123';

    it('should throw NotFoundException if user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.makeUserMerchant(userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update user role to ADMIN and create merchant if it does not exist', async () => {
      const mockUser = { id: userId, name: 'Taras', role: Role.CUSTOMER };
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.merchant.findFirst.mockResolvedValue(null);

      const result = await service.makeUserMerchant(userId);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { role: Role.ADMIN },
      });

      expect(prismaMock.merchant.create).toHaveBeenCalledWith({
        data: {
          name: 'Заклад Taras',
          cashbackRate: 10.0,
          adminId: userId,
        },
      });

      expect(result).toEqual({ success: true, message: 'Тепер ви мерчант!' });
    });

    it('should update user role to ADMIN but skip creating merchant if it already exists', async () => {
      const mockUser = { id: userId, name: 'Taras', role: Role.CUSTOMER };
      const existingMerchant = { id: 'merch-1', adminId: userId };
      
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      prismaMock.merchant.findFirst.mockResolvedValue(existingMerchant);

      const result = await service.makeUserMerchant(userId);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { role: Role.ADMIN },
      });

      expect(prismaMock.merchant.create).not.toHaveBeenCalled();
      expect(result).toEqual({ success: true, message: 'Тепер ви мерчант!' });
    });
  });
});
