import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';
import { getQrPayload } from '../services/authService';

function QRCodeDisplay({ value, size = 100 }) {
  const [qrValue, setQrValue] = useState(value || '');
  const [loading, setLoading] = useState(!value);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (value) {
      setQrValue(value);
      return;
    }

    async function fetchQrPayload() {
      try {
        setLoading(true);

        const data = await getQrPayload();

        setQrValue(data.qr_payload);
        setError(null);
      } catch {
        setError('Не вдалося згенерувати QR-код');
      } finally {
        setLoading(false);
      }
    }

    fetchQrPayload();

    const interval = setInterval(fetchQrPayload, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, [value]);

  if (loading) {
    return (
      <div
        className="notice-success"
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--card-bg-solid)',
          borderRadius: '16px',
        }}
      >
        <span>Завантаження...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="notice-error"
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--danger-light)',
          borderRadius: '16px',
          padding: '16px',
          textAlign: 'center',
        }}
      >
        <span>{error}</span>
      </div>
    );
  }

  return (
    <QRCodeSVG
      value={qrValue}
      size={size}
      level="M"
      includeMargin
      style={{ borderRadius: '12px' }}
    />
  );
}

export default QRCodeDisplay;
