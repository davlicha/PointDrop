import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainLayout from './layouts/MainLayout';
import MainApp from './pages/MainApp';
import LoginPage from './pages/LoginPage';
import TransactionTable from './components/TransactionTable';
import { checkHealth } from './services/healthService';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Захищений роут
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ color: '#fff', padding: '20px' }}>Завантаження...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Сторінка історії транзакцій
function TransactionsPage() {
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
    {
      id: 3,
      amount: '+200',
      name: 'Антон',
      time: '5 годин тому',
      status: 'Отримано',
      color: '#2E7D32',
    },
  ];

  return (
    <div style={transactionsPageStyles.wrapper}>
      <div style={transactionsPageStyles.phone}>
        <h2 style={transactionsPageStyles.title}>Історія транзакцій</h2>
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
}

const transactionsPageStyles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  phone: {
    width: '390px',
    minHeight: '844px',
    background: '#3B3940',
    padding: '24px 18px 28px',
    boxSizing: 'border-box',
    color: '#FFFFFF',
  },
  title: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    color: '#FFFFFF',
  },
};

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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
