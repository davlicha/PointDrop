import { NOT_FOUND_TEXT } from '../constants/uiText';

// Сторінка 404
function NotFoundPage() {
  return (
    // Контейнер сторінки
    <section style={styles.page}>
      {/* Картка помилки */}
      <div style={styles.card}>
        {/* Код помилки */}
        <h1 style={styles.code}>{NOT_FOUND_TEXT.code}</h1>

        {/* Заголовок */}
        <h2 style={styles.title}>{NOT_FOUND_TEXT.title}</h2>

        {/* Опис */}
        <p style={styles.text}>{NOT_FOUND_TEXT.description}</p>

        {/* Кнопка повернення */}
        <a href="/" style={styles.button}>
          {NOT_FOUND_TEXT.button}
        </a>
      </div>
    </section>
  );
}

// Стилі сторінки
const styles = {
  // Mobile-frame як у додатку
  page: {
    width: '390px',
    minHeight: '700px',
    background: '#3B3940',
    padding: '90px 18px 28px',
    boxSizing: 'border-box',
    color: '#FFFFFF',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  // Темна картка
  card: {
    width: '100%',
    background: '#1A1A1D',
    borderRadius: '18px',
    padding: '32px 24px',
    boxSizing: 'border-box',
    textAlign: 'center',
  },

  // Код 404
  code: {
    margin: '0 0 12px 0',
    fontSize: '64px',
    lineHeight: '64px',
    color: '#FFFFFF',
  },

  // Заголовок
  title: {
    margin: '0 0 12px 0',
    fontSize: '22px',
    color: '#FFFFFF',
  },

  // Опис
  text: {
    margin: '0 0 24px 0',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#CCCCCC',
  },

  // Кнопка
  button: {
    display: 'inline-block',
    background: '#2F7D1F',
    color: '#FFFFFF',
    borderRadius: '16px',
    padding: '12px 18px',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

// Експорт сторінки
export default NotFoundPage;
