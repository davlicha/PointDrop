import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainLayout from './layouts/MainLayout';
import MainApp from './pages/MainApp';
import TransactionTable from './components/TransactionTable';
import { checkHealth } from './services/healthService';

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

// Стилі сторінки транзакцій
const transactionsPageStyles = {
  // Центрування сторінки
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },

  // Контейнер у стилі мобільного екрана
  phone: {
    width: '390px',
    minHeight: '844px',
    background: '#3B3940',
    padding: '24px 18px 28px',
    boxSizing: 'border-box',
    color: '#FFFFFF',
  },

  // Заголовок сторінки
  title: {
    margin: '0 0 20px 0',
    fontSize: '20px',
    color: '#FFFFFF',
  },
};

// Головний компонент додатку
function App() {
  // Текст статусу бекенду
  const [backendStatus, setBackendStatus] = useState('Перевірка...');

  // Ознака доступності бекенду
  const [backendOk, setBackendOk] = useState(false);

  // Перевірка бекенду після завантаження
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
      <MainLayout backendStatus={backendStatus} backendOk={backendOk}>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
