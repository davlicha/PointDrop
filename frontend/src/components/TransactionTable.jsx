import { useMemo, useState } from 'react';

// Таблиця транзакцій
function TransactionTable({ transactions = [] }) {
  // Поточна сторінка
  const [currentPage, setCurrentPage] = useState(1);

  // Кількість елементів на сторінці
  const itemsPerPage = 2;

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
        <p style={styles.emptyTitle}>Транзакцій поки немає</p>
        <p style={styles.emptyText}>
          Після переказів або нарахувань вони з’являться тут.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Список транзакцій */}
      <div style={styles.transactionsList}>
        {currentTransactions.map((item) => (
          <div key={item.id} style={styles.transactionCard}>
            {/* Верх картки */}
            <div style={styles.transactionTop}>
              {/* Сума та ім’я */}
              <div style={styles.transactionLeft}>
                <span
                  style={{
                    ...styles.amount,
                    color: item.color,
                  }}
                >
                  {item.amount}
                </span>

                <span
                  style={{
                    ...styles.cardMini,
                    color: item.color,
                  }}
                >
                  ▭
                </span>

                <span style={styles.personName}>{item.name}</span>
              </div>

              {/* Час */}
              <div style={styles.transactionRight}>
                <span style={styles.timeText}>{item.time}</span>
              </div>
            </div>

            {/* Низ картки */}
            <div style={styles.transactionBottom}>
              <span style={styles.statusText}>{item.status}</span>
              <span style={styles.arrow}>{'>'}</span>
            </div>
          </div>
        ))}
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
          Назад
        </button>

        <span style={styles.pageInfo}>
          Сторінка {currentPage} з {totalPages}
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
          Далі
        </button>
      </div>
    </div>
  );
}

const styles = {
  // Список транзакцій
  transactionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },

  // Картка транзакції
  transactionCard: {
    background: '#F2F2F2',
    borderRadius: '16px',
    padding: '14px 16px',
  },

  // Верх картки
  transactionTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },

  // Ліва частина
  transactionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Права частина
  transactionRight: {
    display: 'flex',
    alignItems: 'center',
  },

  // Сума
  amount: {
    fontSize: '12px',
    fontWeight: '700',
  },

  // Іконка картки
  cardMini: {
    fontSize: '15px',
  },

  // Ім’я користувача
  personName: {
    fontSize: '12px',
    color: '#111111',
  },

  // Час операції
  timeText: {
    fontSize: '11px',
    color: '#111111',
    textAlign: 'right',
  },

  // Низ картки
  transactionBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Статус транзакції
  statusText: {
    fontSize: '11px',
    color: '#111111',
    marginLeft: '28px',
  },

  // Стрілка
  arrow: {
    fontSize: '18px',
    color: '#111111',
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
