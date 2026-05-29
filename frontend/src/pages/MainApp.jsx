import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionTable from '../components/TransactionTable.jsx';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { checkHealth } from '../services/healthService';
import { transferPoints } from '../services/transactionService';
import { useAuth } from '../hooks/useAuth';
import { getQrPayload } from '../services/authService';
import UserSearch from '../components/UserSearch';
import PointDropModal from '../components/PointDropModal';
import CashierPage from './CashierPage';
import { makeMeMerchant } from '../services/userService';

// Головний компонент додатка
function App() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  // Поточний екран
  const [screen, setScreen] = useState('main');

  // Статус бекенду
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  // Перевірка зв'язку з бекендом
  useEffect(() => {
    async function fetchHealth() {
      try {
        const data = await checkHealth();
        setHealth(data);
      } catch {
        setError('Бекенд недоступний');
      }
    }

    fetchHealth();
  }, []);

  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  useEffect(() => {
    import('../services/transactionService').then(({ getMyTransactions }) => {
      getMyTransactions()
        .then((data) => {
          const mapped = data.map(t => ({
            id: t.id,
            amount: t.type === 'EARN' || t.receiverId === t.id ? '+' + t.amount : '-' + t.amount,
            name: t.type,
            time: new Date(t.timestamp).toLocaleString(),
            status: t.type,
            color: t.type === 'EARN' || t.receiverId === t.id ? '#10b981' : '#ef4444',
          }));
          setTransactions(mapped);
        })
        .catch(console.error)
        .finally(() => setLoadingTransactions(false));
    });
  }, []);

  // Відкриває потрібний екран
  const renderScreen = () => {
    switch (screen) {
      case 'main':
        return (
          <MainScreen
            setScreen={setScreen}
            transactions={transactions}
            backendError={error}
            backendHealth={health}
          />
        );
      case 'qr':
        return <QRScreen setScreen={setScreen} />;
      case 'scan':
        return <ScanScreen setScreen={setScreen} />;
      case 'profile':
        return <ProfileScreen setScreen={setScreen} navigate={navigate} logout={logout} />;
      case 'intro':
        return <IntroScreen setScreen={setScreen} />;
      case 'success':
        return <SuccessScreen setScreen={setScreen} />;
      case 'error':
        return <ErrorScreen setScreen={setScreen} />;
      case 'cashier':
        return <CashierPage setScreen={setScreen} />;
      case 'menu':
        return <MenuScreen setScreen={setScreen} transactions={transactions} />;
      default:
        return (
          <MainScreen
            setScreen={setScreen}
            transactions={transactions}
            backendError={error}
            backendHealth={health}
          />
        );
    }
  };

  return <main className="app-container">{renderScreen()}</main>;
}

// Головний екран
function MainScreen({ setScreen, transactions, backendError, backendHealth }) {
  const { user } = useAuth();
  const [receiverPhone, setReceiverPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [transferStatus, setTransferStatus] = useState('');
  const [isTransferLoading, setIsTransferLoading] = useState(false);

  async function handleTransfer() {
    setTransferStatus('');

    if (!receiverPhone.trim() || !amount) {
      setTransferStatus('Введіть телефон отримувача та кількість балів');
      return;
    }

    try {
      setIsTransferLoading(true);

      await transferPoints({
        receiverPhone: receiverPhone.trim(),
        amount,
      });

      setTransferStatus('Переказ успішно виконано');
      setReceiverPhone('');
      setAmount('');
      setScreen('success');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Не вдалося виконати переказ';

      setTransferStatus(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setIsTransferLoading(false);
    }
  }

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setShowModal(true);
  };

  return (
    <section className="page-section animate-fade-in">
      <Header
        title="PointDrop"
        leftAction={() => setScreen('menu')}
        leftSymbol={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        }
        showRightIcons
        setScreen={setScreen}
      />

      <div className="glass-card balance-card">
        <div className="balance-row">
          <div className="balance-left">
            <span className="star-icon">✦</span>
            <p className="greeting-text">Привіт, {user?.name?.split(' ')[0] || 'Користувачу'}!</p>
          </div>

          <div className="balance-right">
            <p className="balance-text">Баланс: {user?.balances?.[0]?.pointsAmount || 0} pt</p>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h2 className="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          Швидкий переказ
        </h2>

        {backendError && <p className="notice-error">{backendError}</p>}
        {backendHealth && !backendError && (
          <p className="notice-success">Бекенд підключено</p>
        )}

        <div className="transfer-row" style={{ alignItems: 'center' }}>
          <div className="inputs-col">
            <UserSearch 
              merchantId={import.meta.env.VITE_DEMO_MERCHANT_ID} 
              onSelectUser={handleSelectUser} 
            />
            {transferStatus && (
              <p className={transferStatus.includes('Успішно') ? "notice-success" : "notice-error"}>{transferStatus}</p>
            )}
          </div>

          <div className="qr-col">
            <div className="qr-mini-btn" onClick={() => setScreen('qr')} style={{ color: '#09090b' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="5" height="5" rx="1" ry="1"></rect>
                <rect x="16" y="3" width="5" height="5" rx="1" ry="1"></rect>
                <rect x="3" y="16" width="5" height="5" rx="1" ry="1"></rect>
                <path d="M21 16h-3a2 2 0 0 0-2 2v3"></path>
                <path d="M21 21v.01"></path>
                <path d="M12 7v3a2 2 0 0 1-2 2H7"></path>
                <path d="M3 12h.01"></path>
                <path d="M12 3h.01"></path>
                <path d="M12 16v.01"></path>
                <path d="M16 12h1"></path>
                <path d="M21 12v.01"></path>
                <path d="M12 21v-1"></path>
              </svg>
            </div>
            <p className="qr-label">Мій QR</p>
          </div>
        </div>
      </div>

      {showModal && selectedUser && (
        <PointDropModal
          selectedUser={selectedUser}
          merchantId={import.meta.env.VITE_DEMO_MERCHANT_ID}
          senderId={user?.id}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
          onSuccess={(amount) => {
            setShowModal(false);
            setSelectedUser(null);
            setTransferStatus(`Успішно переказано ${amount} балів`);
            setScreen('success');
          }}
        />
      )}

      <h3 className="section-title" style={{ marginTop: '10px' }}>Останні транзакції</h3>

      <TransactionTable transactions={transactions} />
    </section>
  );
}

// Екран QR
function QRScreen({ setScreen }) {
  const { user } = useAuth();
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQrData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getQrPayload();
        setQrData(data);
      } catch (err) {
        console.error('Failed to fetch QR data:', err);
        setError('Не вдалося завантажити QR-код');
      } finally {
        setLoading(false);
      }
    }
    fetchQrData();
  }, []);

  return (
    <section className="page-section animate-fade-in">
      <Header
        title="Мій QR-код"
        leftAction={() => setScreen('main')}
        leftSymbol={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>}
        setScreen={setScreen}
      />

      <div className="center-block">
        {loading ? (
          <div className="glass-card">
            <p className="notice-success">Завантаження...</p>
          </div>
        ) : error ? (
          <div className="glass-card">
            <p className="notice-error">{error}</p>
          </div>
        ) : (
          <>
            <div className="qr-container-lg">
              <QRCodeDisplay value={qrData?.qr_payload} size={220} />
            </div>

            <div className="glass-card" style={{ width: '100%', marginBottom: '40px' }}>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Клієнт</span>
                  <span className="info-value">{user?.name || 'Невідомо'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Телефон</span>
                  <span className="info-value">{user?.phone || 'Невідомо'}</span>
                </div>
              </div>
            </div>
          </>
        )}

        <button
          className="btn btn-primary btn-full"
          onClick={() => setScreen('main')}
        >
          Готово
        </button>
      </div>
    </section>
  );
}

// Екран сканера (Mock)
function ScanScreen({ setScreen }) {
  return (
    <section className="page-section animate-fade-in">
      <Header
        title="Сканер"
        leftAction={() => setScreen('main')}
        leftSymbol={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>}
        setScreen={setScreen}
      />

      <div className="center-block">
        <div style={{ width: '240px', height: '240px', border: '2px dashed var(--primary)', borderRadius: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '32px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Камера...</p>
        </div>

        <p style={{ marginBottom: '32px', color: 'var(--text-secondary)' }}>Наведіть камеру на QR-код користувача</p>

        <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setScreen('success')}>
            Демо: Успіх
          </button>
          <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => setScreen('error')}>
            Демо: Помилка
          </button>
        </div>
      </div>
    </section>
  );
}

// Екран профілю
function ProfileScreen({ setScreen, navigate, logout }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  return (
    <section className="page-section animate-fade-in">
      <Header
        title="Профіль"
        leftAction={() => setScreen('main')}
        leftSymbol={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>}
        setScreen={setScreen}
      />

      <div className="profile-header">
        <div className="avatar-lg">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <button className="btn btn-ghost">Змінити фото</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="profile-balance-badge">
          Баланс: {user?.balances?.[0]?.pointsAmount || 0} pt
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '40px' }}>
        {loading ? (
          <p className="notice-success">Завантаження...</p>
        ) : (
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Ім'я</span>
              <span className="info-value">{user?.name || 'Невідомо'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Телефон</span>
              <span className="info-value">{user?.phone || 'Невідомо'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">E-mail</span>
              <span className="info-value">{user?.email || 'Невідомо'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">ID</span>
              <span className="info-value" style={{ fontFamily: 'monospace' }}>{user?.id?.substring(0, 8) || 'Невідомо'}</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: 'auto' }}>
        <button
          className="btn btn-danger"
          style={{ flex: 1 }}
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Вийти
        </button>
      </div>
    </section>
  );
}

// Екран успішного сканування
function SuccessScreen({ setScreen }) {
  return (
    <section className="page-section animate-fade-in">
      <div className="message-center">
        <div className="status-icon-lg status-success">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h2 className="status-title" style={{ color: 'var(--primary)' }}>Успішно!</h2>
        <p className="status-sub">Транзакція виконана успішно.</p>

        <button
          className="btn btn-primary btn-full"
          style={{ marginTop: '20px' }}
          onClick={() => setScreen('main')}
        >
          На головну
        </button>
      </div>
    </section>
  );
}

// Екран помилки
function ErrorScreen({ setScreen }) {
  return (
    <section className="page-section animate-fade-in">
      <div className="message-center">
        <div className="status-icon-lg status-error">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>
        <h2 className="status-title" style={{ color: 'var(--danger)' }}>Помилка</h2>
        <p className="status-sub">Щось пішло не так. Спробуйте ще раз.</p>

        <button
          className="btn btn-secondary btn-full"
          style={{ marginTop: '20px' }}
          onClick={() => setScreen('main')}
        >
          Повернутися
        </button>
      </div>
    </section>
  );
}

// Екран швидкого переказу
function IntroScreen({ setScreen }) {
  return <MainScreen setScreen={setScreen} />;
}

// Екран меню
function MenuScreen({ setScreen, transactions }) {
  const { user, refreshUserProfile } = useAuth();
  
  const handleMakeMerchant = async () => {
    try {
      await makeMeMerchant();
      await refreshUserProfile();
      alert('Успіх! Ви тепер мерчант. Перейдіть в "Режим касира"');
    } catch (err) {
      alert('Помилка: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <div className="side-menu-overlay" onClick={() => setScreen('main')}></div>
      <div className="side-menu">
        <div className="menu-top">
          <span className="menu-title">PointDrop</span>
          <button
            className="icon-btn"
            onClick={() => setScreen('main')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="menu-nav">
          <button className="menu-item" onClick={() => setScreen('main')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Головна
          </button>
          <button className="menu-item" onClick={() => setScreen('scan')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            Сканер
          </button>
          <button className="menu-item" onClick={() => setScreen('qr')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Мій QR-код
          </button>
          
          {user?.role === 'CUSTOMER' && (
            <button className="menu-item" onClick={handleMakeMerchant}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              Стати мерчантом (Тест)
            </button>
          )}

          {user?.role === 'ADMIN' && (
            <button className="menu-item" onClick={() => setScreen('cashier')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              Режим касира
            </button>
          )}

          <button className="menu-item" onClick={() => setScreen('profile')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Налаштування
          </button>
        </div>
      </div>
      
      {/* Background layer */}
      <MainScreen setScreen={() => {}} transactions={transactions} />
    </>
  );
}

// Шапка екрана
function Header({
  title,
  leftAction,
  leftSymbol,
  showRightIcons = false,
  setScreen,
}) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-btn" onClick={leftAction}>
          {leftSymbol}
        </button>
        <span className="header-title">{title}</span>
      </div>

      <div className="header-right">
        {showRightIcons && (
          <>
            <button
              className="header-mini-btn"
              onClick={() => setScreen('qr')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            <button className="header-mini-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
            <button
              className="header-mini-btn"
              onClick={() => setScreen('profile')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default App;
