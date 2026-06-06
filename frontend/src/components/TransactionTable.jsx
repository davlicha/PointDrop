import React, { useMemo, useState } from 'react';

function TransactionTable({ transactions }) {
  // Поточна сторінка
  const [currentPage, setCurrentPage] = useState(1);

  // К-сть елементів на сторінці
  const itemsPerPage = 3;

  // Загальна к-сть сторінок
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  // Дані для поточної сторінки
  const currentTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return transactions.slice(startIndex, endIndex);
  }, [transactions, currentPage]);

  function handlePrevPage() {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }

  function handleNextPage() {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '32px 20px' }}>
        <div style={{
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--primary-light)',
          marginBottom: '16px',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        </div>
        <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '15px', marginBottom: '6px' }}>
          Транзакцій ще немає
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          Ваші транзакції з'являться тут після першого переказу або нарахування балів
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <div className="tx-list">
        {currentTransactions.map((item) => {
          const isPositive = item.amount.toString().startsWith('+');
          const amountClass = isPositive ? 'tx-amount-plus' : 'tx-amount-minus';

          return (
            <div key={item.id} className="tx-card">
              <div className="tx-top">
                <div className="tx-left">
                  <div className={`tx-icon ${isPositive ? 'bg-primary-light' : 'bg-danger-light'}`}>
                    {isPositive ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                    )}
                  </div>
                  <div>
                    <div className="tx-name">{item.name}</div>
                    <div className="tx-status">{item.status}</div>
                  </div>
                </div>

                <div className="tx-right">
                  <div className={`tx-amount ${amountClass}`}>{item.amount} pt</div>
                  <div className="tx-time">{item.time}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className={`btn btn-secondary ${currentPage === 1 ? 'btn-disabled' : ''}`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            style={{ padding: '8px 12px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>

          <span className="page-info">
            {currentPage} / {totalPages}
          </span>

          <button
            className={`btn btn-secondary ${currentPage === totalPages ? 'btn-disabled' : ''}`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            style={{ padding: '8px 12px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default React.memo(TransactionTable);
