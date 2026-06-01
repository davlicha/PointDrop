import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainLayout from './layouts/MainLayout';
import MainApp from './pages/MainApp';
import LoginPage from './pages/LoginPage';
<<<<<<< HEAD

// Сторінка 404
import NotFoundPage from './pages/NotFoundPage';

// Таблиця транзакцій
=======
>>>>>>> 3fb98ba37b5792e35628134c07d90d6cf0f9610d
import TransactionTable from './components/TransactionTable';
import { checkHealth } from './services/healthService';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Захищений роут
function ProtectedRoute({ children }) {
  // Дані авторизації
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
<<<<<<< HEAD
    return (
      // Центрування loader
      <div style={loaderStyles.wrapper}>
        {/* Spinner */}
        <div style={loaderStyles.spinner}></div>

        {/* Текст loader */}
        <p style={loaderStyles.text}>Завантаження...</p>
      </div>
    );
=======
    return <div style={{ color: '#fff', padding: '20px' }}>Завантаження...</div>;
>>>>>>> 3fb98ba37b5792e35628134c07d90d6cf0f9610d
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Доступ до сторінки
  return children;
}

<<<<<<< HEAD
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
=======
// Сторінка історії транзакцій
function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    import('./services/transactionService').then(({ getMyTransactions }) => {
      getMyTransactions().then(data => {
        const mapped = data.map(t => ({
          id: t.id,
          amount: t.type === 'EARN' || t.receiverId === t.id ? '+' + t.amount : '-' + t.amount,
          name: t.type,
          time: new Date(t.timestamp).toLocaleString(),
          status: t.type,
          color: t.type === 'EARN' || t.receiverId === t.id ? '#10b981' : '#ef4444',
        }));
        setTransactions(mapped);
      }).catch(console.error);
    });
  }, []);
>>>>>>> 3fb98ba37b5792e35628134c07d90d6cf0f9610d

  return (
    <div className="page-section">
      <h2 className="section-title">Історія транзакцій</h2>
      <TransactionTable transactions={transactions} />
    </div>
  );
}

// Внутрішній компонент додатку
function AppContent() {
  const [backendStatus, setBackendStatus] = useState('Перевірка...');
  const [backendOk, setBackendOk] = useState(false);
  const { isAuthenticated } = useAuth();

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
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : (
            <MainLayout backendStatus={backendStatus} backendOk={backendOk}>
              <LoginPage />
            </MainLayout>
          )
        }
      />
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
    </Routes>
  );
}

// Головний компонент
function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
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
=======
      <AuthProvider>
        <AppContent />
      </AuthProvider>
>>>>>>> 3fb98ba37b5792e35628134c07d90d6cf0f9610d
    </BrowserRouter>
  );
}

<<<<<<< HEAD
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
=======
>>>>>>> 3fb98ba37b5792e35628134c07d90d6cf0f9610d
export default App;
