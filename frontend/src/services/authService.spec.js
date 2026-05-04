import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const { register } = require('./authService');
      
      vi.spyOn(api, 'post').mockResolvedValue({
        data: {
          id: '123',
          email: 'test@example.com',
          name: 'Test User',
        },
      });

      const result = await register({
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
      const { login } = require('./authService');
      
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
      vi.spyOn(api, 'post').mockResolvedValue({
        data: {
          access_token: mockToken,
        },
      });

      const result = await login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.access_token).toBe(mockToken);
      expect(localStorage.getItem('access_token')).toBe(mockToken);
    });

    it('should throw error if login fails', async () => {
      const { login } = require('./authService');
      
      vi.spyOn(api, 'post').mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow();
    });
  });

  describe('getQrPayload', () => {
    it('should fetch QR payload from backend', async () => {
      const { getQrPayload } = require('./authService');
      
      const mockPayload = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      vi.spyOn(api, 'get').mockResolvedValue({
        data: {
          qr_payload: mockPayload,
        },
      });

      const result = await getQrPayload();

      expect(result.qr_payload).toBe(mockPayload);
      expect(api.get).toHaveBeenCalledWith('/auth/qr-payload');
    });
  });

  describe('logout', () => {
    it('should clear stored tokens on logout', () => {
      const { logout } = require('./authService');
      
      localStorage.setItem('access_token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: '123' }));

      logout();

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists', () => {
      const { isAuthenticated } = require('./authService');
      
      localStorage.setItem('access_token', 'test-token');

      expect(isAuthenticated()).toBe(true);
    });

    it('should return false if token does not exist', () => {
      const { isAuthenticated } = require('./authService');
      
      localStorage.removeItem('access_token');

      expect(isAuthenticated()).toBe(false);
    });
  });
});
