/**
 * Test utilities and helpers for frontend tests
 */

import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../hooks/useAuth';

/**
 * Custom render function that includes common providers
 */
export function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  function Wrapper({ children }: { children: ReactElement }) {
    return (
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

/**
 * Mock API response generator
 */
export const generateMockResponse = (data: any, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {},
});

/**
 * Mock user data for testing
 */
export const generateMockUser = (overrides = {}) => ({
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'test@example.com',
  phone: '+380961234567',
  name: 'Test User',
  role: 'CUSTOMER',
  createdAt: new Date().toISOString(),
  ...overrides,
});

/**
 * Mock JWT token for testing
 */
export const generateMockToken = () =>
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJyb2xlIjoiQ1VTVE9NRVIifQ.test';

/**
 * Mock QR payload for testing
 */
export const generateMockQrPayload = () =>
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTUwZTg0MDAtZTI5Yi00MWQ0LWE3MTYtNDQ2NjU1NDQwMDAwIiwidGltZXN0YW1wIjoxNjk0NzgyODM2MDY3fQ.test';

/**
 * Setup localStorage mock
 */
export const setupLocalStorage = () => {
  const store: Record<string, string> = {};

  const mockLocalStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
  };

  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
  });

  return mockLocalStorage;
};

/**
 * Wait for element with timeout
 */
export const waitForElement = async (
  callback: () => HTMLElement | null,
  timeout = 3000,
) => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const element = callback();
    if (element) return element;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  throw new Error(`Element not found within ${timeout}ms`);
};
