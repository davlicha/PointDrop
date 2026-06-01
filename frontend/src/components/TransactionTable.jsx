import { useMemo, useState } from 'react';
import { TRANSACTIONS_TEXT } from '../constants/uiText';

function TransactionTable({ transactions }) {
  // Поточна сторінка
  const [currentPage, setCurrentPage] = useState(1);

  // К-сть елементів на сторінці
  const itemsPerPage = 3; // Increased to 3 since cards will be smaller

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

<<<<<<< HEAD
  // Якщо транзакцій немає
  if (transactions.length === 0) {
    return (
      <div style={styles.emptyState}>
        {/* Заголовок порожнього стану */}
        <p style={styles.emptyTitle}>{TRANSACTIONS_TEXT.empty}</p>

        {/* Опис порожнього стану */}
        <p style={styles.emptyText}>{TRANSACTIONS_TEXT.emptyDescription}</p>
      </div>
    );
=======
  if (!transactions || transactions.length === 0) {
    return <p className="notice-success">Немає транзакцій</p>;
>>>>>>> 3fb98ba37b5792e35628134c07d90d6cf0f9610d
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

<<<<<<< HEAD
      {/* Пагінація */}
      <div style={styles.pagination}>
        <button
          style={{
            ...styles.pageButton,
            opacity: currentPage === 1 ? 0.5 : 1,
            cursor: currentPage === 1 ? 'default' : 'pointer',
          }}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          {TRANSACTIONS_TEXT.previous}
        </button>

        <span style={styles.pageInfo}>
          {`Сторінка ${currentPage} з ${totalPages}`}
        </span>

        <button
          style={{
            ...styles.pageButton,
            opacity: currentPage === totalPages ? 0.5 : 1,
            cursor: currentPage === totalPages ? 'default' : 'pointer',
          }}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          {TRANSACTIONS_TEXT.next}
        </button>
      </div>
=======
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
>>>>>>> 3fb98ba37b5792e35628134c07d90d6cf0f9610d
    </div>
  );
}

export default TransactionTable;
