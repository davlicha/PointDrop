import { useMemo, useState } from 'react';

function TransactionTable({ transactions }) {
  // Поточна сторінка
  const [currentPage, setCurrentPage] = useState(1);

  // К-сть елементів на сторінці
  const itemsPerPage = 2;

  // Загальна к-сть сторінок
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  // Дані для поточної сторінки
  const currentTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage; // початок
    const endIndex = startIndex + itemsPerPage; // кінець

    return transactions.slice(startIndex, endIndex); // вирізаємо частину
  }, [transactions, currentPage]);

  // Попередня сторінка
  function handlePrevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  // Наступна сторінка
  function handleNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <div>
      <div style={styles.transactionsList}>
        {currentTransactions.map((item) => (
          <div key={item.id} style={styles.transactionCard}>
            
            
            <div style={styles.transactionTop}>
              
              
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

                <span style={styles.personName}>
                  {item.name} 
                </span>
              </div>

              
              <div style={styles.transactionRight}>
                <span style={styles.timeText}>
                  {item.time} 
                </span>
              </div>
            </div>

            
            <div style={styles.transactionBottom}>
              <span style={styles.statusText}>
                {item.status} 
              </span>

              <span style={styles.arrow}>
                {'>'} 
              </span>
            </div>
          </div>
        ))}
      </div>

     
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

  // Маленька іконка
  cardMini: {
    fontSize: '15px',
  },

  // Ім’я
  personName: {
    fontSize: '12px',
    color: '#111111',
  },

  // Дата і час
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

  // Статус
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

  // Текст сторінки
  pageInfo: {
    color: '#FFFFFF',
    fontSize: '12px',
  },
};

export default TransactionTable;
