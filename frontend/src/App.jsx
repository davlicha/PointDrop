import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import MainApp from './pages/MainApp';
import LoginPage from './pages/LoginPage';
import TransactionTable from './components/TransactionTable';
import MerchantDashboard from './pages/MerchantDashboard';
import NotFoundPage from './pages/NotFoundPage';
import ForbiddenPage from './pages/ForbiddenPage';
import ErrorBoundary from './components/ErrorBoundary';
import { checkHealth } from './services/healthService';
import { getMyTransactions } from './services/transactionService';
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
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMyTransactions()
      .then((data) => {
        const mapped = data.map(t => {
          const isEarn = t.type === 'EARN';
          const isReceiver = t.receiverId === user?.id;
          
          let statusText = t.type;
          if (isEarn) {
            statusText = t.merchant?.name ? `Від: ${t.merchant.name}` : 'Нарахування';
          } else if (t.type === 'TRANSFER') {
            if (isReceiver) {
              statusText = t.sender?.name ? `Від: ${t.sender.name}` : 'Переказ';
            } else {
              statusText = t.receiver?.name ? `Кому: ${t.receiver.name}` : 'Переказ';
            }
          } else if (t.type === 'REDEEM') {
            statusText = t.merchant?.name ? `Списання: ${t.merchant.name}` : 'Списання';
          }

          const isPositive = isEarn || (t.type === 'TRANSFER' && isReceiver);

          return {
            id: t.id,
            amount: isPositive ? '+' + t.amount : '-' + t.amount,
            name: t.type === 'EARN' ? 'Нарахування' : t.type === 'TRANSFER' ? 'Переказ' : 'Списання',
            time: new Date(t.timestamp).toLocaleString(),
            status: statusText,
            color: isPositive ? '#10b981' : '#ef4444',
          };
        });
        setTransactions(mapped);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="app-container">
      <div className="page-section" style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
          <button 
            onClick={() => navigate('/')} 
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              border: 'none', 
              color: '#fff', 
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Історія транзакцій</h2>
        </div>
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
}

// Внутрішній компонент додатку
function AppContent() {
  const [backendStatus, setBackendStatus] = useState('Перевірка...');
  const [backendOk, setBackendOk] = useState(false);
  const { isAuthenticated, user } = useAuth();

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
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user?.role === 'ADMIN' ? (
              <MainLayout backendStatus={backendStatus} backendOk={backendOk}>
                <MerchantDashboard />
              </MainLayout>
            ) : (
              <MainLayout backendStatus={backendStatus} backendOk={backendOk}>
                <ForbiddenPage />
              </MainLayout>
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/403"
        element={
          <MainLayout backendStatus={backendStatus} backendOk={backendOk}>
            <ForbiddenPage />
          </MainLayout>
        }
      />
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
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

