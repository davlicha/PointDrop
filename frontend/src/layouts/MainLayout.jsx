// Базовий layout додатку
function MainLayout({ children, backendStatus, backendOk }) {
  return (
    <div style={styles.wrapper}>


      {/* Основний контент */}
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  // Загальна обгортка сторінки
  wrapper: {
    height: '100%',
    width: '100%',
    background: '#111111',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '0',
    boxSizing: 'border-box',
  },

  // Контент під верхньою панеллю
  main: {
    width: '100%',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 0,
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
};

export default MainLayout;
