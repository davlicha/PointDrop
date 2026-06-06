import { Test, TestingModule } from '@nestjs/testing';
import { TransactionType } from '@prisma/client';
import { TransactionsController } from './transactions.controller';
import { TransactionsService, TransactionResult } from './transactions.service';
import { EarnPointsDto, RedeemPointsDto, TransferPointsDto } from './dto';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            transfer: jest.fn(),
            earn: jest.fn(),
            redeem: jest.fn(),
            getUserTransactions: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('transfer', () => {
    it('should call service.transfer and return transaction', async () => {
      const dto: TransferPointsDto = {
        senderId: 'sender-123',
        receiverPhone: '+380501110002',
        merchantId: 'merchant-123',
        amount: 50,
      };

      const mockTransaction: any = { id: 'tx-1', type: TransactionType.TRANSFER };
      jest.spyOn(service, 'transfer').mockResolvedValue(mockTransaction);

      const result = await controller.transfer(dto);

      expect(service.transfer).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('earn', () => {
    it('should call service.earn and return mapped response', async () => {
      const dto: EarnPointsDto = {
        qrPayload: 'qr',
        merchantId: 'merchant-123',
        amountSpent: 1000,
      };

      const mockDate = new Date();
      const mockResult: TransactionResult = {
        transaction: {
          id: 'tx-2',
          type: TransactionType.EARN,
          amount: 100,
          merchantId: 'merchant-123',
          receiverId: 'user-123',
          senderId: null,
          createdAt: mockDate,
        },
        currentBalance: 150,
      };

      jest.spyOn(service, 'earn').mockResolvedValue(mockResult);

      const result = await controller.earn(dto);

      expect(service.earn).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        id: 'tx-2',
        type: TransactionType.EARN,
        amount: 100,
        merchantId: 'merchant-123',
        receiverId: 'user-123',
        createdAt: mockDate,
        currentBalance: 150,
      });
    });
  });

  describe('redeem', () => {
    it('should call service.redeem and return mapped response', async () => {
      const dto: RedeemPointsDto = {
        userId: 'user-123',
        merchantId: 'merchant-123',
        requestedPoints: 50,
      };

      const mockDate = new Date();
      const mockResult: TransactionResult = {
        transaction: {
          id: 'tx-3',
          type: TransactionType.REDEEM,
          amount: 50,
          merchantId: 'merchant-123',
          receiverId: 'user-123',
          senderId: null,
          createdAt: mockDate,
        },
        currentBalance: 100,
      };

      jest.spyOn(service, 'redeem').mockResolvedValue(mockResult);

      const result = await controller.redeem(dto);

      expect(service.redeem).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        id: 'tx-3',
        type: TransactionType.REDEEM,
        amount: 50,
        merchantId: 'merchant-123',
        receiverId: 'user-123',
        createdAt: mockDate,
        currentBalance: 100,
      });
    });
  });

  describe('getMyTransactions', () => {
    it('should call service.getUserTransactions with userId from request', async () => {
      const req = { user: { id: 'user-123' } };
      const mockTransactions: any = [{ id: 'tx-1' }];
      
      jest.spyOn(service, 'getUserTransactions').mockResolvedValue(mockTransactions);

      const result = await controller.getMyTransactions(req);

      expect(service.getUserTransactions).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(mockTransactions);
    });
  });
});
