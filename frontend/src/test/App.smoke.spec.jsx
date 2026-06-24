import React from 'react';
import { render, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Mock axios to prevent actual network requests during the smoke test
vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        get: vi.fn().mockResolvedValue({ data: {} }),
        post: vi.fn().mockResolvedValue({ data: {} }),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        }
      }))
    }
  };
});

describe('App Smoke Test', () => {
  it('should render without crashing', async () => {
    let container;
    await act(async () => {
      const result = render(<App />);
      container = result.container;
    });
    expect(container).toBeTruthy();
  });
});
