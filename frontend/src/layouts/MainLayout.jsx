import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Базовий layout додатку
function MainLayout({ children, backendOk }) {
  // Навігація після виходу
  const navigate = useNavigate();

  // Дані авторизації
  const { logout, isAuthenticated } = useAuth();

  // Вихід з акаунта
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Стиль активного посилання
  const getLinkStyle = ({ isActive }) => ({
    ...styles.link,
    ...(isActive ? styles.activeLink : {}),
  });

  return (
    <div style={styles.wrapper}>
      {/* Верхня панель */}
      <nav style={styles.nav}>
        {/* Назва проєкту */}
        <div style={styles.brand}>PointDrop</div>

        {/* Права частина панелі */}
        <div style={styles.rightBlock}>
          {/* Статус API */}
          <span
            style={{
              ...styles.status,
              color: backendOk ? '#7ED957' : '#FF6B6B',
            }}
          >
            {backendOk ? 'API OK' : 'API OFF'}
          </span>

          {/* Навігація */}
          <div style={styles.links}>
            <NavLink to="/" style={getLinkStyle}>
              Головна
            </NavLink>

            <NavLink to="/transactions" style={getLinkStyle}>
              Транзакції
            </NavLink>

            {isAuthenticated && (
              <button style={styles.logoutButton} onClick={handleLogout}>
                Вийти
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Основний контент */}
      <main style={styles.main}>{children}</main>
    </div>
  );
}

// Стилі layout
const styles = {
  // Загальна обгортка
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
    maxWidth: '92%',
    minHeight: '56px',
    background: '#111111',
    borderRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 10px',
    boxSizing: 'border-box',
    marginBottom: '20px',
    border: '1px solid #2A2A2A',
    gap: '6px',
    overflow: 'hidden',
  },

  // Назва проєкту
  brand: {
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },

  // Права частина navbar
  rightBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    minWidth: 0,
    flex: 1,
    justifyContent: 'flex-end',
  },

  // Статус API
  status: {
    fontSize: '8px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },

  // Блок посилань
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    minWidth: 0,
  },

  // Посилання
  link: {
    color: '#FFFFFF',
    textDecoration: 'none',
    fontSize: '10px',
    fontWeight: '500',
    padding: '4px 5px',
    borderRadius: '8px',
  },

  // Активне посилання
  activeLink: {
    background: '#2F7D1F',
  },

  // Кнопка виходу
  logoutButton: {
    background: '#8B2E2E',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    padding: '5px 8px',
    cursor: 'pointer',
    fontSize: '10px',
    whiteSpace: 'nowrap',
  },

  // Основний контент
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
