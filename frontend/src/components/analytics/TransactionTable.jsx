import React from 'react';
import { TRANSACTION_TYPES } from '../../constants/transaction';
import './TransactionTable.css';

const TransactionTable = ({
  transactions = [],
  isLoading = false,
  page = 1,
  totalPages = 1,
  totalCount = 0,
  onPageChange = () => {},
}) => {
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getAvatarBgClass = (name) => {
    const classes = ['bg-blue', 'bg-orange', 'bg-green', 'bg-cyan', 'bg-purple'];
    if (!name) return classes[0];
    const index = name.length % classes.length;
    return classes[index];
  };

  const getStatusInfo = (type) => {
    switch (type) {
      case TRANSACTION_TYPES.EARN:
        return { text: 'Скан', class: 'status-earn', amountClass: 'amount-earn', prefix: '+' };
      case TRANSACTION_TYPES.REDEEM:
        return { text: 'Списано', class: 'status-redeem', amountClass: 'amount-redeem', prefix: '-' };
      case TRANSACTION_TYPES.TRANSFER:
        return { text: 'Переказ', class: 'status-transfer', amountClass: 'amount-transfer', prefix: '-' };
      default:
        return { text: 'Невідомо', class: '', amountClass: '', prefix: '' };
    }
  };

  if (isLoading) {
    return (
      <div className="transaction-list">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="transaction-card">
            <div className="tx-left">
              <div className="skeleton skeleton-avatar"></div>
              <div className="tx-info">
                <div className="skeleton skeleton-text-lg"></div>
                <div className="skeleton skeleton-text-sm"></div>
              </div>
            </div>
            <div className="tx-right">
              <div className="skeleton skeleton-text-lg"></div>
              <div className="skeleton skeleton-text-sm"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <div style={{
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(107, 114, 128, 0.1)',
          marginBottom: '16px',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>
        <p style={{ fontWeight: 500, fontSize: '15px', color: '#ffffff', marginBottom: '6px' }}>
          Немає знайдених транзакцій
        </p>
        <p style={{ fontSize: '13px' }}>
          Спробуйте змінити фільтри або пошуковий запит
        </p>
      </div>
    );
  }

  const startIndex = (page - 1) * 4 + 1;
  const endIndex = Math.min(startIndex + transactions.length - 1, totalCount);

  return (
    <>
      <div className="transaction-list">
        {transactions.map((tx) => {
          const status = getStatusInfo(tx.type);
          const name = tx.receiver?.name || 'Невідомий';
          const handle = tx.receiver?.phone ? `@${String(tx.receiver.phone).replace(/[^0-9]/g, '').slice(-6)}` : '';
          
          return (
            <div key={tx.id} className="transaction-card">
              <div className="tx-left">
                <div className={`tx-avatar ${getAvatarBgClass(name)}`}>
                  {getInitials(name)}
                </div>
                <div className="tx-info">
                  <div className="tx-name">
                    {name} <span className="tx-handle">{handle}</span>
                  </div>
                  <div className={`tx-status ${status.class}`}>
                    <div className="dot"></div>
                    {status.text}
                  </div>
                </div>
              </div>
              <div className="tx-right">
                <div className={`tx-amount ${status.amountClass}`}>
                  {status.prefix}{tx.amount} pts
                </div>
                <div className="tx-time">
                  {formatTime(tx.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pagination-container">
        <div className="pagination-text">
          {startIndex}–{endIndex} з {totalCount || transactions.length}
        </div>
        <div className="pagination-arrows">
          <button 
            className="arrow-btn" 
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <button 
            className="arrow-btn" 
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default React.memo(TransactionTable);
