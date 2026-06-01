import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import MainLayout from './layouts/MainLayout';
import MainApp from './pages/MainApp';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

import TransactionTable from './components/TransactionTable';
import { checkHealth } from './services/healthService';
import { getMyTransactions } from './services/transactionService';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Захищений роут
function ProtectedRoute({ children }) {
  // Дані авторизації
  const { isAuthenticated, loading } = useAuth();

  // Loader під час перевірки auth
  if (loading) {
    return (
      <div style={loaderStyles.wrapper}>
        {/* Spinner */}
        <div style={loaderStyles.spinner}></div>

        {/* Текст loader */}
        <p style={loaderStyles.text}>Завантаження...</p>
      </div>
    );
  }

  // Перехід на login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Доступ до сторінки
  return children;
}

// Сторінка історії транзакцій
function TransactionsPage() {
  // Список транзакцій
  const [transactions, setTransactions] = useState([]);

  // Стан завантаження
  const [loading, setLoading] = useState(true);

  // Текст помилки
  const [error, setError] = useState('');

  // Завантаження транзакцій з API
  useEffect(() => {
    async function loadTransactions() {
      try {
        setLoading(true);
        setError('');

        const data = await getMyTransactions();

        const mappedTransactions = data.map((transaction) => {
          const isIncome =
            transaction.type === 'EARN' || transaction.type === 'RECEIVE';

          return {
            id: transaction.id,
            amount: `${isIncome ? '+' : '-'}${transaction.amount}`,
            name: transaction.type,
            time: new Date(transaction.timestamp).toLocaleString('uk-UA'),
            status: transaction.type,
            color: isIncome ? '#2E7D32' : '#8B2E2E',
          };
        });

        setTransactions(mappedTransactions);
      } catch {
        setError('Не вдалося завантажити транзакції');
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, []);

  return (
    <div style={transactionsPageStyles.wrapper}>
      <div style={transactionsPageStyles.phone}>
        {/* Заголовок */}
        <h2 style={transactionsPageStyles.title}>Історія транзакцій</h2>

        {/* Loader */}
        {loading && (
          <p style={transactionsPageStyles.message}>
            Завантаження транзакцій...
          </p>
        )}

        {/* Помилка */}
        {error && <p style={transactionsPageStyles.error}>{error}</p>}

        {/* Таблиця транзакцій */}
        {!loading && !error && <TransactionTable transactions={transactions} />}
      </div>
    </div>
  );
}

// Внутрішній компонент додатку
function AppContent() {
  // Статус backend
  const [backendStatus, setBackendStatus] = useState('Перевірка...');

  // Стан backend
  const [backendOk, setBackendOk] = useState(false);

  // Дані авторизації
  const { isAuthenticated } = useAuth();

  // Перевірка backend
  useEffect(() => {
    async function loadBackendStatus() {
      try {
        await checkHealth();

        setBackendStatus('Backend: OK');
        setBackendOk(true);
      } catch {
        setBackendStatus('Backend недоступний');
        setBackendOk(false);
      }
    }

    loadBackendStatus();
  }, []);

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <MainLayout backendStatus={backendStatus} backendOk={backendOk}>
              <LoginPage />
            </MainLayout>
          )
        }
      />

      {/* Головна */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout backendStatus={backendStatus} backendOk={backendOk}>
              <MainApp />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Транзакції */}
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <MainLayout backendStatus={backendStatus} backendOk={backendOk}>
              <TransactionsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <MainLayout backendStatus={backendStatus} backendOk={backendOk}>
            <NotFoundPage />
          </MainLayout>
        }
      />
    </Routes>
  );
}

// Головний компонент
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

// Стилі loader
const loaderStyles = {
  // Контейнер loader
  wrapper: {
    width: '390px',
    minHeight: '844px',
    background: '#3B3940',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '14px',
    color: '#FFFFFF',
  },

  // Текст loader
  text: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
  },

  // Spinner
  spinner: {
    width: '42px',
    height: '42px',
    border: '4px solid #2A2A2A',
    borderTop: '4px solid #2F7D1F',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Стилі сторінки транзакцій
const transactionsPageStyles = {
  // Центрування
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },

  // Контейнер екрана
  phone: {
    width: '390px',
    minHeight: '844px',
    background: '#3B3940',
    padding: '24px 18px 28px',
    boxSizing: 'border-box',
    color: '#FFFFFF',
  },

  // Заголовок
  title: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    color: '#FFFFFF',
  },

  // Повідомлення
  message: {
    color: '#FFFFFF',
    fontSize: '13px',
  },

  // Помилка
  error: {
    color: '#FFB4B4',
    fontSize: '13px',
  },
};

export default App;
