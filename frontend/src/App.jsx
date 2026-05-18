import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Layout додатку
import MainLayout from './layouts/MainLayout';

// Головна сторінка
import MainApp from './pages/MainApp';

// Сторінка авторизації
import LoginPage from './pages/LoginPage';

// Сторінка 404
import NotFoundPage from './pages/NotFoundPage';

// Таблиця транзакцій
import TransactionTable from './components/TransactionTable';

// Auth context
import { AuthProvider, useAuth } from './hooks/useAuth';

// Health check backend
import { checkHealth } from './services/healthService';

// Сторінка транзакцій
function TransactionsPage() {
  // Тимчасові mock-дані
  const transactions = [
    {
      id: 1,
      amount: '+100',
      name: 'Наталі',
      time: '5 хвилин тому',
      status: 'Отримано',
      color: '#2E7D32',
    },
    {
      id: 2,
      amount: '-50',
      name: 'Ліза',
      time: '1 година тому',
      status: 'Переказано',
      color: '#8B2E2E',
    },
  ];

  return (
    <div style={transactionsPageStyles.wrapper}>
      <div style={transactionsPageStyles.phone}>
        {/* Заголовок */}
        <h2 style={transactionsPageStyles.title}>Історія транзакцій</h2>

        {/* Таблиця транзакцій */}
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
}

// Захищений route
function ProtectedRoute({ children }) {
  // Дані авторизації
  const { isAuthenticated, loading } = useAuth();

  // Loader під час перевірки auth
  if (loading) {
    return (
      // Центрування loader
      <div style={loaderStyles.wrapper}>
        {/* Текст loader */}
        <p style={loaderStyles.text}>Завантаження...</p>
      </div>
    );
  }

  // Redirect на login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Доступ до сторінки
  return children;
}

// Стилі loader
const loaderStyles = {
  // Контейнер loader
  wrapper: {
    width: '390px',
    minHeight: '844px',
    background: '#3B3940',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FFFFFF',
  },

  // Текст loader
  text: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
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
};

// Основний routing
function AppContent() {
  // Статус backend
  const [backendStatus, setBackendStatus] = useState('Перевірка...');

  // Стан backend
  const [backendOk, setBackendOk] = useState(false);

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
    <BrowserRouter>
      {/* Layout */}
      <MainLayout backendStatus={backendStatus} backendOk={backendOk}>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Головна */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            }
          />

          {/* Транзакції */}
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <TransactionsPage />
              </ProtectedRoute>
            }
          />

          {/* 404 сторінка */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

// Root App
function App() {
  return (
    // Auth provider
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Експорт додатку
export default App;
