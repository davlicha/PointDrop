import { Test, TestingModule } from '@nestjs/testing';
import { TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TransferPointsDto } from './dto/transfer-points.dto';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prismaMock: {
    $transaction: jest.Mock;
    user: { findUniqueOrThrow: jest.Mock };
    balance: { update: jest.Mock; upsert: jest.Mock };
    transaction: { create: jest.Mock };
  };

  const dto: TransferPointsDto = {
    senderId: '550e8400-e29b-41d4-a716-446655440000',
    receiverPhone: '+380501110002',
    merchantId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    amount: 50,
  };

  const receiverId = 'd4c3b2a1-f6e5-0987-dcba-0987fedcba01';

  beforeEach(async () => {
    prismaMock = {
      $transaction: jest.fn((cb: (tx: unknown) => unknown) => cb(prismaMock)),
      user: { findUniqueOrThrow: jest.fn() },
      balance: { update: jest.fn(), upsert: jest.fn() },
      transaction: { create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should successfully transfer points and return the created transaction record', async () => {
    const fakeTransaction = {
      id: 't1r2a3n4-s5a6-7890-abcd-ef1234567890',
      type: TransactionType.TRANSFER,
      amount: dto.amount,
      merchantId: dto.merchantId,
      senderId: dto.senderId,
      receiverId,
      timestamp: new Date(),
    };

    prismaMock.user.findUniqueOrThrow.mockResolvedValue({ id: receiverId });
    prismaMock.balance.update.mockResolvedValue({});
    prismaMock.balance.upsert.mockResolvedValue({});
    prismaMock.transaction.create.mockResolvedValue(fakeTransaction);

    const result = await service.transfer(dto);

    expect(result).toEqual(fakeTransaction);
    expect(result.type).toBe(TransactionType.TRANSFER);
    expect(result.amount).toBe(50);
    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { phone: dto.receiverPhone },
      select: { id: true },
    });
  });

  it('should decrement sender balance and upsert receiver balance with correct arguments', async () => {
    prismaMock.user.findUniqueOrThrow.mockResolvedValue({ id: receiverId });
    prismaMock.balance.update.mockResolvedValue({});
    prismaMock.balance.upsert.mockResolvedValue({});
    prismaMock.transaction.create.mockResolvedValue({
      id: 'tx-id',
      type: TransactionType.TRANSFER,
      amount: dto.amount,
      merchantId: dto.merchantId,
      senderId: dto.senderId,
      receiverId,
      timestamp: new Date(),
    });

    await service.transfer(dto);

    expect(prismaMock.balance.update).toHaveBeenCalledWith({
      where: {
        userId_merchantId: {
          userId: dto.senderId,
          merchantId: dto.merchantId,
        },
      },
      data: { pointsAmount: { decrement: dto.amount } },
    });

    expect(prismaMock.balance.upsert).toHaveBeenCalledWith({
      where: {
        userId_merchantId: {
          userId: receiverId,
          merchantId: dto.merchantId,
        },
      },
      create: {
        userId: receiverId,
        merchantId: dto.merchantId,
        pointsAmount: dto.amount,
      },
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

  it('should propagate prisma errors up the call stack', async () => {
    prismaMock.user.findUniqueOrThrow.mockResolvedValue({ id: receiverId });
    prismaMock.balance.update.mockResolvedValue({});
    prismaMock.balance.upsert.mockResolvedValue({});
    prismaMock.transaction.create.mockRejectedValue(
      new Error('DB connection lost'),
    );

    await expect(service.transfer(dto)).rejects.toThrow('DB connection lost');
    expect(prismaMock.transaction.create).toHaveBeenCalledTimes(1);
  });
});
