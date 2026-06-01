import { useMemo, useState } from 'react';
import { TRANSACTIONS_TEXT } from '../constants/uiText';

// Таблиця транзакцій
function TransactionTable({ transactions = [] }) {
  // Поточна сторінка
  const [currentPage, setCurrentPage] = useState(1);

  // Кількість елементів на сторінці
  const itemsPerPage = 3;

  // Загальна кількість сторінок
  const totalPages = Math.max(1, Math.ceil(transactions.length / itemsPerPage));

  // Дані для поточної сторінки
  const currentTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return transactions.slice(startIndex, endIndex);
  }, [transactions, currentPage]);

  // Перехід назад
  function handlePrevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  // Перехід вперед
  function handleNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

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
  }

  return (
    <div style={styles.wrapper}>
      {/* Список транзакцій */}
      <div style={styles.transactionsList}>
        {currentTransactions.map((item) => {
          const isPositive = item.amount.toString().startsWith('+');

          return (
            <div key={item.id} style={styles.transactionCard}>
              {/* Верх картки */}
              <div style={styles.transactionTop}>
                {/* Ліва частина */}
                <div style={styles.transactionLeft}>
                  {/* Іконка */}
                  <div
                    style={{
                      ...styles.icon,
                      background: isPositive ? '#DFF5D8' : '#F5D8D8',
                    }}
                  >
                    <span
                      style={{
                        ...styles.iconText,
                        color: isPositive ? '#2E7D32' : '#8B2E2E',
                      }}
                    >
                      {isPositive ? '↑' : '↓'}
                    </span>
                  </div>

                  {/* Назва і статус */}
                  <div>
                    <p style={styles.personName}>{item.name}</p>
                    <p style={styles.statusText}>{item.status}</p>
                  </div>
                </div>

                {/* Права частина */}
                <div style={styles.transactionRight}>
                  <p
                    style={{
                      ...styles.amount,
                      color: isPositive ? '#2E7D32' : '#8B2E2E',
                    }}
                  >
                    {item.amount} pt
                  </p>

                  <p style={styles.timeText}>{item.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
    </div>
  );
}

const styles = {
  // Обгортка
  wrapper: {
    width: '100%',
  },

  // Список транзакцій
  transactionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  // Картка транзакції
  transactionCard: {
    background: '#F2F2F2',
    borderRadius: '16px',
    padding: '12px 14px',
  },

  // Верх картки
  transactionTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
  },

  // Ліва частина
  transactionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: 0,
  },

  // Права частина
  transactionRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
    flexShrink: 0,
  },

  // Іконка
  icon: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },

  // Текст іконки
  iconText: {
    fontSize: '18px',
    fontWeight: '700',
  },

  // Ім’я / тип
  personName: {
    margin: 0,
    fontSize: '12px',
    fontWeight: '700',
    color: '#111111',
  },

  // Статус транзакції
  statusText: {
    margin: '4px 0 0 0',
    fontSize: '11px',
    color: '#444444',
  },

  // Сума
  amount: {
    margin: 0,
    fontSize: '12px',
    fontWeight: '700',
  },

  // Час
  timeText: {
    margin: 0,
    fontSize: '10px',
    color: '#555555',
    textAlign: 'right',
  },

  // Пагінація
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
    gap: '10px',
  },

  // Кнопка пагінації
  pageButton: {
    background: '#2F7D1F',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    padding: '8px 12px',
    fontSize: '12px',
  },

  // Інформація про сторінку
  pageInfo: {
    color: '#FFFFFF',
    fontSize: '12px',
  },

  // Порожній стан
  emptyState: {
    background: '#1A1A1D',
    border: '1px solid #3A3A3A',
    borderRadius: '16px',
    padding: '18px',
    textAlign: 'center',
  },

  // Заголовок порожнього стану
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '700',
    margin: '0 0 8px',
  },

  // Опис порожнього стану
  emptyText: {
    color: '#AAAAAA',
    fontSize: '12px',
    margin: 0,
    lineHeight: '18px',
  },
};

export default TransactionTable;
