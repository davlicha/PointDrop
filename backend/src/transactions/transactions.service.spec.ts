import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { TransactionsService } from './transactions.service';
import { TransferPointsDto, EarnPointsDto, RedeemPointsDto } from './dto';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let authService: AuthService;
  let prismaMock: {
    $transaction: jest.Mock;
    user: { findFirst: jest.Mock };
    balance: { update: jest.Mock; upsert: jest.Mock; findUnique: jest.Mock };
    transaction: { create: jest.Mock; findMany: jest.Mock };
    merchant: { findUnique: jest.Mock };
  };

  beforeEach(async () => {
    prismaMock = {
      $transaction: jest.fn(async (cb: (tx: any) => any) => await cb(prismaMock)),
      user: { findFirst: jest.fn() },
      balance: { update: jest.fn(), upsert: jest.fn(), findUnique: jest.fn() },
      transaction: { create: jest.fn(), findMany: jest.fn() },
      merchant: { findUnique: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: AuthService,
          useValue: { verifyQrPayload: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('transfer', () => {
    const dto: TransferPointsDto = {
      senderId: 'sender-123',
      receiverPhone: '+380501110002',
      merchantId: 'merchant-123',
      amount: 50,
    };
    const receiverId = 'receiver-123';

    it('should throw NotFoundException if receiver is not found', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);

      await expect(service.transfer(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if sender tries to transfer to themselves', async () => {
      prismaMock.user.findFirst.mockResolvedValue({ id: dto.senderId });

      await expect(service.transfer(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if sender balance is insufficient', async () => {
      prismaMock.user.findFirst.mockResolvedValue({ id: receiverId });
      prismaMock.balance.findUnique.mockResolvedValue({ pointsAmount: 30 }); // 30 < 50

      await expect(service.transfer(dto)).rejects.toThrow(ConflictException);
    });

    it('should successfully transfer points', async () => {
      const fakeTransaction = {
        id: 'tx-123',
        type: TransactionType.TRANSFER,
        amount: dto.amount,
        merchantId: dto.merchantId,
        senderId: dto.senderId,
        receiverId,
        timestamp: new Date(),
      };

      prismaMock.user.findFirst.mockResolvedValue({ id: receiverId });
      prismaMock.balance.findUnique.mockResolvedValue({ pointsAmount: 100 });
      prismaMock.balance.update.mockResolvedValue({});
      prismaMock.balance.upsert.mockResolvedValue({});
      prismaMock.transaction.create.mockResolvedValue(fakeTransaction);

      const result = await service.transfer(dto);

      expect(result).toEqual(fakeTransaction);
      expect(prismaMock.balance.update).toHaveBeenCalledWith({
        where: {
          userId_merchantId: { userId: dto.senderId, merchantId: dto.merchantId },
        },
        data: { pointsAmount: { decrement: dto.amount } },
      });
      expect(prismaMock.balance.upsert).toHaveBeenCalledWith({
        where: {
          userId_merchantId: { userId: receiverId, merchantId: dto.merchantId },
        },
        create: { userId: receiverId, merchantId: dto.merchantId, pointsAmount: dto.amount },
        update: { pointsAmount: { increment: dto.amount } },
      });
      expect(prismaMock.transaction.create).toHaveBeenCalledWith({
        data: {
          type: TransactionType.TRANSFER,
          amount: dto.amount,
          merchantId: dto.merchantId,
          senderId: dto.senderId,
          receiverId,
        },
      });
    });
  });

  describe('earn', () => {
    const dto: EarnPointsDto = {
      qrPayload: 'valid_qr_payload',
      merchantId: 'merchant-123',
      amountSpent: 1000, // 1000 UAH
    };
    const userId = 'user-123';

    it('should throw NotFoundException if merchant is not found', async () => {
      jest.spyOn(authService, 'verifyQrPayload').mockReturnValue({ user_id: userId, timestamp: Date.now() });
      prismaMock.merchant.findUnique.mockResolvedValue(null);

      await expect(service.earn(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if earned points are 0 or less', async () => {
      jest.spyOn(authService, 'verifyQrPayload').mockReturnValue({ user_id: userId, timestamp: Date.now() });
      prismaMock.merchant.findUnique.mockResolvedValue({ id: dto.merchantId, cashbackRate: 0.05 }); // 0.05% of 1000 = 0.5 -> floor = 0

      await expect(service.earn(dto)).rejects.toThrow(BadRequestException);
    });

    it('should calculate points, update balance and create earn transaction', async () => {
      jest.spyOn(authService, 'verifyQrPayload').mockReturnValue({ user_id: userId, timestamp: Date.now() });
      prismaMock.merchant.findUnique.mockResolvedValue({ id: dto.merchantId, cashbackRate: 10.0 }); // 10% of 1000 = 100

      const fakeTransaction = { id: 'tx-earn', type: TransactionType.EARN, amount: 100 };
      prismaMock.balance.upsert.mockResolvedValue({ pointsAmount: 150 });
      prismaMock.transaction.create.mockResolvedValue(fakeTransaction);

      const result = await service.earn(dto);

      expect(prismaMock.balance.upsert).toHaveBeenCalledWith({
        where: { userId_merchantId: { userId, merchantId: dto.merchantId } },
        create: { userId, merchantId: dto.merchantId, pointsAmount: 100 },
        update: { pointsAmount: { increment: 100 } },
      });
      expect(prismaMock.transaction.create).toHaveBeenCalledWith({
        data: {
          type: TransactionType.EARN,
          amount: 100,
          merchantId: dto.merchantId,
          receiverId: userId,
        },
      });
      expect(result).toEqual({ transaction: fakeTransaction, currentBalance: 150 });
    });
  });

  describe('redeem', () => {
    const dto: RedeemPointsDto = {
      userId: 'user-123',
      merchantId: 'merchant-123',
      requestedPoints: 50,
    };

    it('should throw BadRequestException if balance is not found', async () => {
      prismaMock.balance.findUnique.mockResolvedValue(null);

      await expect(service.redeem(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if balance is insufficient', async () => {
      prismaMock.balance.findUnique.mockResolvedValue({ pointsAmount: 30 }); // 30 < 50

      await expect(service.redeem(dto)).rejects.toThrow(BadRequestException);
    });

    it('should decrement balance and create redeem transaction', async () => {
      prismaMock.balance.findUnique.mockResolvedValue({ pointsAmount: 100 });

      const fakeTransaction = { id: 'tx-redeem', type: TransactionType.REDEEM, amount: 50 };
      prismaMock.balance.update.mockResolvedValue({ pointsAmount: 50 });
      prismaMock.transaction.create.mockResolvedValue(fakeTransaction);

      const result = await service.redeem(dto);

      expect(prismaMock.balance.update).toHaveBeenCalledWith({
        where: { userId_merchantId: { userId: dto.userId, merchantId: dto.merchantId } },
        data: { pointsAmount: { decrement: 50 } },
      });
      expect(prismaMock.transaction.create).toHaveBeenCalledWith({
        data: {
          type: TransactionType.REDEEM,
          amount: 50,
          merchantId: dto.merchantId,
          receiverId: dto.userId,
        },
      });
      expect(result).toEqual({ transaction: fakeTransaction, currentBalance: 50 });
    });
  });

  describe('getUserTransactions', () => {
    it('should return list of transactions where user is sender or receiver', async () => {
      const mockTransactions = [{ id: 'tx-1' }, { id: 'tx-2' }];
      prismaMock.transaction.findMany.mockResolvedValue(mockTransactions);

      const result = await service.getUserTransactions('user-123');

      expect(prismaMock.transaction.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ senderId: 'user-123' }, { receiverId: 'user-123' }],
        },
        orderBy: { timestamp: 'desc' },
        take: 20,
      });
      expect(result).toEqual(mockTransactions);
    });
  });
});
