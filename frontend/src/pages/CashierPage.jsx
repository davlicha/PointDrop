import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { earnPoints } from '../services/transactionService';
import QRScanner from '../components/QRScanner';

export default function CashierPage({ setScreen }) {
  const { user } = useAuth();
  const [qrPayload, setQrPayload] = useState('');
  const [amountSpent, setAmountSpent] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const merchant = user?.managedMerchants?.[0] || user?.employer; // Get managed merchant for ADMIN, or employer for CASHIER

  const handleEarn = async (e) => {
    e.preventDefault();
    if (!merchant) {
      setStatusMessage('Помилка: Ви не прив\'язані до жодного закладу.');
      return;
    }

    setStatusMessage('');
    setLoading(true);

    try {
      const result = await earnPoints({
        qrPayload,
        merchantId: merchant.id,
        amountSpent,
      });
      setStatusMessage(`Успішно! Зараховано ${result.amount} балів.`);
      setQrPayload('');
      setAmountSpent('');
    } catch (err) {
      setStatusMessage(`Помилка: ${err.response?.data?.message || 'Не вдалося нарахувати бали'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section animate-fade-in">
      <header className="header">
        <div className="header-left">
          <button className="icon-btn" onClick={() => setScreen('main')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <span className="header-title">Панель Касира</span>
        </div>
      </header>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', marginTop: '16px' }}>
        Заклад: <strong style={{ color: 'var(--text-primary)' }}>{merchant?.name || 'Невідомо'}</strong>
      </p>

      <div className="glass-card">
        <h3 className="section-title" style={{ fontSize: '18px', marginBottom: '16px' }}>Нарахування балів</h3>
        <form onSubmit={handleEarn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
              QR Payload Клієнта
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="input-base"
                placeholder="Вставте QR код сюди"
                value={qrPayload}
                onChange={(e) => setQrPayload(e.target.value)}
                required
                style={{ marginBottom: '0' }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '0 16px', height: '48px', flexShrink: 0 }}
                onClick={() => setIsScanning(!isScanning)}
                title="Сканувати QR"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </button>
            </div>
          </div>

          {isScanning && (
            <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '8px' }}>
              <p style={{ textAlign: 'center', marginBottom: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                Наведіть камеру на QR-код клієнта
              </p>
              <QRScanner
                onScanSuccess={(decodedText) => {
                  setQrPayload(decodedText);
                  setIsScanning(false);
                }}
              />
              <button
                type="button"
                className="btn btn-ghost btn-full"
                style={{ marginTop: '12px' }}
                onClick={() => setIsScanning(false)}
              >
                Закрити сканер
              </button>
            </div>
          )}

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
              Сума чеку (грн)
            </label>
            <input
              type="number"
              className="input-base"
              placeholder="Введіть суму покупки"
              value={amountSpent}
              onChange={(e) => setAmountSpent(e.target.value)}
              required
              min="1"
            />
          </div>

          {statusMessage && (
            <div style={{ padding: '12px', borderRadius: '12px', background: statusMessage.startsWith('Успішно') ? 'rgba(16, 185, 129, 0.1)' : 'var(--danger-light)', color: statusMessage.startsWith('Успішно') ? '#10b981' : 'var(--danger)' }}>
              {statusMessage}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !merchant}
            style={{ marginTop: '8px' }}
          >
            {loading ? 'Обробка...' : 'Нарахувати бали'}
          </button>
        </form>
      </div>
    </section>
  );
}
