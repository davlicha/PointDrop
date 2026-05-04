import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import QRCodeDisplay from './QRCodeDisplay';

vi.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value }) => <div data-testid="qr-code">{value}</div>,
}));

vi.mock('../services/authService', () => ({
  getQrPayload: vi.fn(),
}));

describe('QRCodeDisplay Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    const { getQrPayload } = require('../services/authService');
    getQrPayload.mockImplementation(() => new Promise(() => {}));

    render(<QRCodeDisplay />);

    expect(screen.getByText('Завантаження...')).toBeInTheDocument();
  });

  it('should render QR code when value is provided', () => {
    render(<QRCodeDisplay value="test-qr-payload" size={100} />);

    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    expect(screen.getByText('test-qr-payload')).toBeInTheDocument();
  });

  it('should fetch and render QR payload from backend', async () => {
    const { getQrPayload } = require('../services/authService');
    const mockPayload = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
    getQrPayload.mockResolvedValue({ qr_payload: mockPayload });

    render(<QRCodeDisplay />);

    await waitFor(() => {
      expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    });
  });

  it('should display error message if QR fetch fails', async () => {
    const { getQrPayload } = require('../services/authService');
    getQrPayload.mockRejectedValue(new Error('API Error'));

    render(<QRCodeDisplay />);

    await waitFor(() => {
      expect(screen.getByText('Не вдалося згенерувати QR-код')).toBeInTheDocument();
    });
  });

  it('should refresh QR payload every 4 minutes', async () => {
    const { getQrPayload } = require('../services/authService');
    getQrPayload.mockResolvedValue({ qr_payload: 'test-payload' });

    vi.useFakeTimers();
    render(<QRCodeDisplay />);

    expect(getQrPayload).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(4 * 60 * 1000);

    await waitFor(() => {
      expect(getQrPayload).toHaveBeenCalledTimes(2);
    });

    vi.useRealTimers();
  });
});
