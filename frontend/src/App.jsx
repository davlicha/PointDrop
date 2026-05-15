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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
