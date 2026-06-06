import React, { useState, useEffect } from 'react';
import { getAnalyticsSummary, getTransactionHistory } from '../services/analytics.service';
import TransactionTable from '../components/analytics/TransactionTable';
import { useAuth } from '../hooks/useAuth';
import './MerchantDashboard.css';

const MerchantDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  
  const [summaryError, setSummaryError] = useState(null);
  const [transactionsError, setTransactionsError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [filterType, setFilterType] = useState('ALL'); // ALL, EARN, REDEEM, TRANSFER
  const [searchQuery, setSearchQuery] = useState('');
  
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
      const data = await getTransactionHistory(merchantId, { page: currentPage, limit: 50 });
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
        setTotalPages(Math.ceil(filtered.length / 50) || 1);
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

  useEffect(() => {
    fetchSummary();
  }, [merchantId]);

  useEffect(() => {
    fetchTransactions(page);
  }, [merchantId, page, filterType, searchQuery]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Адмін панель</h1>
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

      <section>
        <div className="section-header">
          <h2 className="section-title">ТРАНЗАКЦІЇ</h2>
          <a href="#" className="view-all" onClick={(e) => { e.preventDefault(); setFilterType('ALL'); setPage(1); }}>Всі →</a>
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

        <TransactionTable
          transactions={transactions}
          isLoading={isLoadingTransactions}
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={setPage}
        />
      </section>
    </div>
  );
};

export default MerchantDashboard;
