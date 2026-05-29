import React from 'react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import * as authService from '../services/authService';
import * as userService from '../services/userService';

// Mock the services
vi.mock('../services/authService', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  getQrPayload: vi.fn(),
}));

vi.mock('../services/userService', () => ({
  getCurrentUserProfile: vi.fn().mockResolvedValue({
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
    phone: '+380501234567',
  }),
}));

describe('AuthProvider and useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should provide auth context', () => {
    const TestComponent = () => {
      const { isAuthenticated } = useAuth();
      return <div>{isAuthenticated ? 'Logged in' : 'Logged out'}</div>;
    };

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Logged out')).toBeInTheDocument();
  });

  it('should handle login', async () => {
    authService.login.mockResolvedValue({ access_token: 'test-token' });
    userService.getCurrentUserProfile.mockResolvedValue({
      id: '123',
      name: 'Test User',
      email: 'test@example.com',
    });

    const TestComponent = () => {
      const { login, isAuthenticated, user } = useAuth();
      const [email, setEmail] = React.useState('');
      const [password, setPassword] = React.useState('');

      return (
        <div>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <button onClick={() => login(email, password)}>Login</button>
          {user && <div>{user.name}</div>}
        </div>
      );
    };

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalled();
    });
  });

  it('should handle logout', async () => {
    localStorage.setItem('access_token', 'test-token');

    const TestComponent = () => {
      const { logout, isAuthenticated } = useAuth();
      return (
        <div>
          <div>{isAuthenticated ? 'Logged in' : 'Logged out'}</div>
          <button onClick={logout}>Logout</button>
        </div>
      );
    };

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled();
    });
  });
});
