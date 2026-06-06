import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';
import * as authService from './authService';

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      vi.spyOn(api, 'post').mockResolvedValue({
        data: {
          id: '123',
          email: 'test@example.com',
          name: 'Test User',
        },
      });

      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        phone: '+380501234567',
      });

      expect(result.email).toBe('test@example.com');
      expect(api.post).toHaveBeenCalledWith('/auth/register', expect.objectContaining({
        email: 'test@example.com',
      }));
    });
  });

  describe('login', () => {
    it('should successfully login and store token', async () => {
      
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
      vi.spyOn(api, 'post').mockResolvedValue({
        data: {
          access_token: mockToken,
        },
      });

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.access_token).toBe(mockToken);
      expect(localStorage.getItem('access_token')).toBe(mockToken);
    });

    it('should throw error if login fails', async () => {
      
      vi.spyOn(api, 'post').mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow();
    });
  });

  describe('getQrPayload', () => {
    it('should fetch QR payload from backend', async () => {
      
      const mockPayload = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      vi.spyOn(api, 'get').mockResolvedValue({
        data: {
          qr_payload: mockPayload,
        },
      });

      const result = await authService.getQrPayload();

      expect(result.qr_payload).toBe(mockPayload);
      expect(api.get).toHaveBeenCalledWith('/auth/qr-payload');
    });
  });

  describe('logout', () => {
    it('should clear stored tokens on logout', () => {
      
      localStorage.setItem('access_token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: '123' }));

      authService.logout();

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists', () => {
      
      localStorage.setItem('access_token', 'test-token');

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false if token does not exist', () => {
      
      localStorage.removeItem('access_token');

      expect(authService.isAuthenticated()).toBe(false);
    });
  });
});
