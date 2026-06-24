import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalyticsSummary, getTransactionHistory } from '../services/analytics.service';
import { getMerchantUsers, updateUserRole, updateUserBalance } from '../services/admin.service';
import TransactionTable from '../components/analytics/TransactionTable';
import { useAuth } from '../hooks/useAuth';
import './MerchantDashboard.css';

const MerchantDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('TRANSACTIONS'); // TRANSACTIONS or USERS

  // Custom modal state for balance updating
  const [balanceModalUser, setBalanceModalUser] = useState(null);
  const [newBalanceInput, setNewBalanceInput] = useState('');
  const [isUpdatingBalance, setIsUpdatingBalance] = useState(false);

  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const [summaryError, setSummaryError] = useState(null);
  const [transactionsError, setTransactionsError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [filterType, setFilterType] = useState('ALL'); // ALL, EARN, REDEEM, TRANSFER
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryUsers, setSearchQueryUsers] = useState('');

  const { user } = useAuth();

  // merchantId з профілю авторизованого користувача
  const merchantId = user?.managedMerchants?.[0]?.id;

  const fetchSummary = async () => {
    setIsLoadingSummary(true);
    setSummaryError(null);
    try {
      const data = await getAnalyticsSummary(merchantId);
      setSummary(data);
    } catch (error) {
      setSummaryError('Не вдалося завантажити статистику');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const fetchTransactions = async (currentPage) => {
    setIsLoadingTransactions(true);
    setTransactionsError(null);
    try {
      const data = await getTransactionHistory(merchantId, { page: currentPage, limit: 4 });
      let filtered = data.data || [];

      // Client-side filtering just for UI demo, in a real app this should be server-side
      if (filterType !== 'ALL') {
        filtered = filtered.filter(tx => tx.type === filterType);
      }
      if (searchQuery.trim() !== '') {
        const lowerQ = searchQuery.toLowerCase();
        filtered = filtered.filter(tx =>
          tx.receiver?.name?.toLowerCase()?.includes(lowerQ) ||
          tx.receiver?.phone?.includes(lowerQ)
        );
      }

      setTransactions(filtered);

      if (filterType !== 'ALL' || searchQuery.trim() !== '') {
        setTotalPages(Math.ceil(filtered.length / 4) || 1);
        setTotalCount(filtered.length);
      } else {
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);
      }
    } catch (error) {
      setTransactionsError('Не вдалося завантажити історію транзакцій');
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const fetchUsers = async () => {
    if (!merchantId) return;
    setIsLoadingUsers(true);
    try {
      const data = await getMerchantUsers(merchantId);
      setUsersList(data);
    } catch (error) {
      console.error('Не вдалося завантажити користувачів', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsersList(usersList.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      alert('Помилка при зміні ролі');
    }
  };

  const openBalanceModal = (user) => {
    setBalanceModalUser(user);
    setNewBalanceInput(user.balance.toString());
  };

  const handleBalanceSubmit = async () => {
    if (!balanceModalUser) return;
    
    const newBalance = parseInt(newBalanceInput, 10);
    if (isNaN(newBalance) || newBalance < 0) {
      alert('Будь ласка, введіть коректне невід\'ємне число');
      return;
    }

    setIsUpdatingBalance(true);
    try {
      await updateUserBalance(balanceModalUser.id, merchantId, newBalance);
      setUsersList(usersList.map(u => u.id === balanceModalUser.id ? { ...u, balance: newBalance } : u));
      // Оновлюємо також загальну статистику та транзакції, бо створилась нова транзакція коригування
      fetchSummary();
      fetchTransactions(page);
      setBalanceModalUser(null);
    } catch (error) {
      console.error('Balance update error:', error);
      if (error.response) {
        console.error('Backend response:', error.response.data);
      }
      alert('Помилка при оновленні балансу. Перевірте консоль (F12) для деталей.');
    } finally {
      setIsUpdatingBalance(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [merchantId]);

  useEffect(() => {
    if (activeTab === 'TRANSACTIONS') {
      fetchTransactions(page);
    } else if (activeTab === 'USERS') {
      fetchUsers();
    }
  }, [merchantId, page, filterType, searchQuery, activeTab]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <h1 style={{ margin: 0 }}>Адмін панель</h1>
        </div>
        <div className="header-actions">
          <button className="icon-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <button className="icon-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
          <div className="avatar-badge">АД</div>
        </div>
      </header>

      {summaryError && (
        <div className="error-banner">
          <p>{summaryError}</p>
          <button className="retry-button" onClick={fetchSummary}>Спробувати знову</button>
        </div>
      )}

      <div className="summary-cards-grid">
        <div className="summary-card">
          <h3 className="summary-card-title">КОРИСТУВАЧІВ</h3>
          {isLoadingSummary ? (
            <div className="skeleton" style={{ height: '32px', width: '60px', marginBottom: '8px' }}></div>
          ) : (
            <div className="summary-card-value" style={{ color: '#00ff88' }}>
              {summary?.totalCustomers?.toLocaleString('uk-UA') || 0}
            </div>
          )}
        </div>

        <div className="summary-card">
          <h3 className="summary-card-title">БАЛАНС</h3>
          {isLoadingSummary ? (
            <div className="skeleton" style={{ height: '32px', width: '80px', marginBottom: '8px' }}></div>
          ) : (
            <div className="summary-card-value">
              {summary?.pointsIssued >= 1000000
                ? (summary.pointsIssued / 1000000).toFixed(1) + 'M'
                : summary?.pointsIssued?.toLocaleString('uk-UA') || 0}
            </div>
          )}
          <div className="card-subtitle">pts у системі</div>
        </div>
      </div>

      <div className="filters-container" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0' }}>
        <button 
          className={`filter-btn ${activeTab === 'TRANSACTIONS' ? 'active' : ''}`} 
          style={{ borderRadius: '8px 8px 0 0', borderBottom: activeTab === 'TRANSACTIONS' ? '2px solid var(--primary)' : 'none', padding: '12px 24px', background: 'transparent' }}
          onClick={() => setActiveTab('TRANSACTIONS')}
        >
          Транзакції
        </button>
        <button 
          className={`filter-btn ${activeTab === 'USERS' ? 'active' : ''}`} 
          style={{ borderRadius: '8px 8px 0 0', borderBottom: activeTab === 'USERS' ? '2px solid var(--primary)' : 'none', padding: '12px 24px', background: 'transparent' }}
          onClick={() => setActiveTab('USERS')}
        >
          Користувачі
        </button>
      </div>

      {activeTab === 'TRANSACTIONS' && (
        <section className="transactions-section">
          <div className="section-header">
            <h2 className="section-title">ТРАНЗАКЦІЇ</h2>
            <a href="#" className="view-all" onClick={(e) => { e.preventDefault(); setFilterType('ALL'); setSearchQuery(''); setPage(1); }}>Скинути фільтри →</a>
          </div>

        <div className="search-container">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            className="search-input"
            placeholder="Пошук користувача..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          />
        </div>

        <div className="filters-container">
          <button className={`filter-btn ${filterType === 'ALL' ? 'active' : ''}`} onClick={() => { setFilterType('ALL'); setPage(1); }}>Всі</button>
          <button className={`filter-btn ${filterType === 'EARN' ? 'active' : ''}`} onClick={() => { setFilterType('EARN'); setPage(1); }}>Нарахування</button>
          <button className={`filter-btn ${filterType === 'REDEEM' ? 'active' : ''}`} onClick={() => { setFilterType('REDEEM'); setPage(1); }}>Списання</button>
          <button className={`filter-btn ${filterType === 'TRANSFER' ? 'active' : ''}`} onClick={() => { setFilterType('TRANSFER'); setPage(1); }}>P2P</button>
        </div>

        {transactionsError && (
          <div className="error-banner">
            <p>{transactionsError}</p>
            <button className="retry-button" onClick={() => fetchTransactions(page)}>Спробувати знову</button>
          </div>
        )}

          <div className="transaction-table-wrapper">
            <TransactionTable
              transactions={transactions}
              isLoading={isLoadingTransactions}
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={setPage}
            />
          </div>
        </section>
      )}

      {activeTab === 'USERS' && (() => {
        const lowerQ = searchQueryUsers.toLowerCase().trim();
        const filteredUsers = usersList.filter(u => 
          u.name?.toLowerCase().includes(lowerQ) || 
          u.email?.toLowerCase().includes(lowerQ) ||
          u.phone?.includes(lowerQ)
        );
        
        return (
          <section className="transactions-section">
            <div className="section-header">
              <h2 className="section-title">КОРИСТУВАЧІ ({filteredUsers.length})</h2>
            </div>
            
            <div className="search-container">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="text"
                className="search-input"
                placeholder="Пошук за ім'ям, email або телефоном..."
                value={searchQueryUsers}
                onChange={(e) => setSearchQueryUsers(e.target.value)}
              />
            </div>
            
            <div className="transaction-table-wrapper">
              {isLoadingUsers ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>Завантаження...</div>
              ) : filteredUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>Користувачів не знайдено</div>
              ) : (
                filteredUsers.map(u => (
                <div key={u.id} className="user-card" style={{
                  background: '#1a1a1a', 
                  border: '1px solid #2a2a2a', 
                  borderRadius: '16px', 
                  padding: '16px', 
                  marginBottom: '12px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '48px', height: '48px', borderRadius: '50%', 
                        backgroundColor: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontWeight: 'bold', fontSize: '18px' 
                      }}>
                        {u.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '16px', marginBottom: '2px' }}>{u.name}</div>
                        <div style={{ color: '#888', fontSize: '13px' }}>{u.email}</div>
                        {u.phone && <div style={{ color: '#888', fontSize: '13px', marginTop: '2px' }}>{u.phone}</div>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#fff' }}>{u.balance} pt</div>
                      <div style={{ color: '#00ff88', fontSize: '12px', fontWeight: 500 }}>Баланс</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #2a2a2a', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#888', fontSize: '13px' }}>Роль:</span>
                      <select 
                        style={{ 
                          padding: '6px 12px', 
                          fontSize: '13px', 
                          borderRadius: '8px', 
                          background: 'rgba(255,255,255,0.05)', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          color: u.role === 'ADMIN' ? '#00ff88' : u.role === 'CASHIER' ? '#3b82f6' : 'white', 
                          cursor: 'pointer', 
                          outline: 'none',
                          fontWeight: 500
                        }}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="CUSTOMER" style={{ color: '#000' }}>Клієнт</option>
                        <option value="CASHIER" style={{ color: '#000' }}>Касир</option>
                        <option value="ADMIN" style={{ color: '#000' }}>Адмін</option>
                      </select>
                    </div>
                    <button 
                      style={{ 
                        background: 'rgba(0, 255, 136, 0.1)', 
                        color: '#00ff88', 
                        padding: '8px 16px', 
                        fontSize: '13px', 
                        borderRadius: '8px', 
                        border: 'none', 
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      onClick={() => openBalanceModal(u)}
                    >
                      ± Баланс
                    </button>
                  </div>
                </div>
              ))
            )}
            </div>
          </section>
        );
      })()}

      {/* Модалка для зміни балансу */}
      {balanceModalUser && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: '#1a1a1a', border: '1px solid #333', borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '400px'
          }}>
            <h3 style={{ marginTop: 0, color: '#fff', fontSize: '20px', marginBottom: '8px' }}>Зміна балансу</h3>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5' }}>
              Введіть новий баланс для <strong>{balanceModalUser.name || balanceModalUser.phone}</strong>.<br/>
              Поточний баланс: <span style={{color: '#fff', fontWeight: 'bold'}}>{balanceModalUser.balance} pt</span>.
            </p>
            <input 
              type="number" 
              value={newBalanceInput}
              onChange={(e) => setNewBalanceInput(e.target.value)}
              style={{
                width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff',
                fontSize: '16px', marginBottom: '24px', outline: 'none', boxSizing: 'border-box'
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setBalanceModalUser(null)}
                style={{ 
                  padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: 'none', 
                  color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 
                }}
                disabled={isUpdatingBalance}
              >
                Скасувати
              </button>
              <button 
                onClick={handleBalanceSubmit}
                style={{ 
                  padding: '12px 20px', background: '#00ff88', color: '#000', 
                  border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
                  opacity: isUpdatingBalance ? 0.7 : 1
                }}
                disabled={isUpdatingBalance}
              >
                {isUpdatingBalance ? 'Збереження...' : 'Зберегти'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantDashboard;
