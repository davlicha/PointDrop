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
      <div style={styles.placeholder}>
        <span>Завантаження...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
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
    />
  );
}

const styles = {
  placeholder: {
    width: '100px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f0f0',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#666',
  },
  error: {
    width: '100px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffe6e6',
    borderRadius: '8px',
    fontSize: '11px',
    color: '#8B2E2E',
    textAlign: 'center',
    padding: '8px',
    boxSizing: 'border-box',
  },
};

export default QRCodeDisplay;
