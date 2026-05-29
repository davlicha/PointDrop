import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';
import {
  transferPoints,
  earnPoints,
  redeemPoints,
  getMyTransactions,
} from './transactionService';

// Мокаємо axios-клієнт
vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('transactionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('transferPoints', () => {
    it('should call /transactions/transfer with correct data', async () => {
      const mockResponse = { id: 'tx-1', amount: 50 };
      api.post.mockResolvedValueOnce({ data: mockResponse });

      const dto = {
        senderId: 'sender-1',
        merchantId: 'merchant-1',
        receiverPhone: '+380501112233',
        amount: '50', // Passed as string to check Number() conversion
      };

      const result = await transferPoints(dto);

      expect(api.post).toHaveBeenCalledWith('/transactions/transfer', {
        senderId: 'sender-1',
        merchantId: 'merchant-1',
        receiverPhone: '+380501112233',
        receiverId: undefined,
        amount: 50, // Should be converted to Number
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('earnPoints', () => {
    it('should call /transactions/earn with correct data', async () => {
      const mockResponse = { id: 'tx-2', amount: 100 };
      api.post.mockResolvedValueOnce({ data: mockResponse });

      const dto = {
        qrPayload: 'valid-qr',
        merchantId: 'merchant-1',
        amountSpent: '1000',
      };

      const result = await earnPoints(dto);

      expect(api.post).toHaveBeenCalledWith('/transactions/earn', {
        qrPayload: 'valid-qr',
        merchantId: 'merchant-1',
        amountSpent: 1000,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('redeemPoints', () => {
    it('should call /transactions/redeem with correct data', async () => {
      const mockResponse = { id: 'tx-3', amount: 30 };
      api.post.mockResolvedValueOnce({ data: mockResponse });

      const dto = {
        userId: 'user-1',
        merchantId: 'merchant-1',
        requestedPoints: '30',
      };

      const result = await redeemPoints(dto);

      expect(api.post).toHaveBeenCalledWith('/transactions/redeem', {
        userId: 'user-1',
        merchantId: 'merchant-1',
        requestedPoints: 30,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getMyTransactions', () => {
    it('should call /transactions/me and return data', async () => {
      const mockResponse = [{ id: 'tx-1' }, { id: 'tx-2' }];
      api.get.mockResolvedValueOnce({ data: mockResponse });

      const result = await getMyTransactions();

      expect(api.get).toHaveBeenCalledWith('/transactions/me');
      expect(result).toEqual(mockResponse);
    });
  });
});
