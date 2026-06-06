import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';
import { getCurrentUserProfile, searchUsers, makeMeMerchant } from './userService';

// Мокаємо axios-клієнт
vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCurrentUserProfile', () => {
    it('should call /auth/me and return data', async () => {
      const mockData = { id: 'user-1', name: 'Ivan' };
      api.get.mockResolvedValueOnce({ data: mockData });

      const result = await getCurrentUserProfile();

      expect(api.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockData);
    });

    it('should throw an error if api call fails', async () => {
      const mockError = new Error('Network error');
      api.get.mockRejectedValueOnce(mockError);

      await expect(getCurrentUserProfile()).rejects.toThrow('Network error');
    });
  });

  describe('searchUsers', () => {
    it('should call /users/search with correct params and return data', async () => {
      const mockData = [{ id: 'user-1', phone: '+38050***4567' }];
      api.get.mockResolvedValueOnce({ data: mockData });

      const phone = '50123';
      const merchantId = 'merchant-123';
      const result = await searchUsers(phone, merchantId);

      expect(api.get).toHaveBeenCalledWith('/users/search', {
        params: { phone, merchantId },
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('makeMeMerchant', () => {
    it('should call /users/make-me-merchant and return data', async () => {
      const mockData = { success: true, message: 'Тепер ви мерчант!' };
      api.post.mockResolvedValueOnce({ data: mockData });

      const result = await makeMeMerchant();

      expect(api.post).toHaveBeenCalledWith('/users/make-me-merchant');
      expect(result).toEqual(mockData);
    });
  });
});
