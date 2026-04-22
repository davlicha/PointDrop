import { Link } from 'react-router-dom';

// Базовий layout додатку
function MainLayout({ children, backendStatus, backendOk }) {
  return (
    <div style={styles.wrapper}>
      {/* Верхня навігаційна панель */}
      <nav style={styles.nav}>
        {/* Назва проєкту */}
        <div style={styles.brand}>PointDrop</div>

        {/* Права частина панелі */}
        <div style={styles.rightBlock}>
          {/* Статус з'єднання з бекендом */}
          <span
            style={{
              ...styles.status,
              color: backendOk ? '#7ED957' : '#FF6B6B',
            }}
          >
            {backendStatus}
          </span>

          {/* Навігаційні посилання */}
          <div style={styles.links}>
            <Link to="/" style={styles.link}>
              Головна
            </Link>

            <Link to="/transactions" style={styles.link}>
              Транзакції
            </Link>
          </div>
        </div>
      </nav>

      {/* Основний контент сторінки */}
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  // Загальна обгортка сторінки
  wrapper: {
    minHeight: '100vh',
    background: '#1E1E1E',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20px',
    boxSizing: 'border-box',
  },

  // Верхня панель
  nav: {
    width: '420px',
    maxWidth: '90%',
    height: '56px',
    background: '#111111',
    borderRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 18px',
    boxSizing: 'border-box',
    marginBottom: '20px',
    border: '1px solid #2A2A2A',
  },

  // Назва проєкту
  brand: {
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: '700',
  },

  // Права частина шапки
  rightBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },

  // Текст статусу бекенду
  status: {
    fontSize: '11px',
    fontWeight: '500',
  },

  // Блок з посиланнями
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },

  // Стиль посилань
  link: {
    color: '#FFFFFF',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
  },

  // Контент під верхньою панеллю
  main: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 0,
    boxSizing: 'border-box',
  },
};

export default MainLayout;
