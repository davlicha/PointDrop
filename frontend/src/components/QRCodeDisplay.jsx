import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';
import { getQrPayload } from '../services/authService';

function QRCodeDisplay({ value, size = 100 }) {
  const [qrValue, setQrValue] = useState(value || '');
  const [loading, setLoading] = useState(!value);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Якщо value передано — використовуємо його
    if (value) {
      setQrValue(value);
      return;
    }

    // Інакше отримуємо QR payload з бекенду
    async function fetchQrPayload() {
      try {
        setLoading(true);
        const data = await getQrPayload();
        setQrValue(data.qr_payload);
        setError(null);
      } catch (err) {
        setError('Не вдалося згенерувати QR-код');
        console.error('QR payload error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchQrPayload();

    // Оновлюємо QR кожні 4 хвилини (payload дійсний 5 хвилин)
    const interval = setInterval(fetchQrPayload, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, [value]);

  if (loading) {
    return (
      <div className="notice-success" style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--card-bg-solid)', borderRadius: '16px' }}>
        <span>Завантаження...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notice-error" style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--danger-light)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <QRCodeSVG
      value={qrValue}
      size={size}
      level="M"
      includeMargin={true}
      style={{ borderRadius: '12px' }}
    />
  );
}

export default QRCodeDisplay;
