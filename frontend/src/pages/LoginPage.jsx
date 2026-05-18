import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { register } from '../services/authService';
import { AUTH_TEXT } from '../constants/uiText';

// Сторінка входу та реєстрації
function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Режим форми
  const [isRegister, setIsRegister] = useState(false);

  // Стан завантаження
  const [loading, setLoading] = useState(false);

  // Текст помилки
  const [error, setError] = useState('');

  // Дані форми
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });

  // Оновлення полів
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Отримання повідомлення помилки
  const getErrorMessage = (err) => {
    const serverMessage = err.response?.data?.message;

    if (Array.isArray(serverMessage)) {
      return serverMessage.join(', ');
    }

    if (serverMessage) {
      return serverMessage;
    }

    if (err.code === 'ERR_NETWORK') {
      return AUTH_TEXT.networkError;
    }

    return AUTH_TEXT.defaultError;
  };

  // Відправка форми
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      // Реєстрація
      if (isRegister) {
        await register(formData);
      }

      // Авторизація
      await login(formData.email, formData.password);

      // Перехід на головну
      navigate('/');
    } catch (err) {
      // Встановлення тексту помилки
      setError(getErrorMessage(err));
    } finally {
      // Вимкнення loader
      setLoading(false);
    }
  };

  // Перемикання режиму
  const handleModeSwitch = () => {
    setIsRegister(!isRegister);
    setError('');
  };

  return (
    <section style={styles.wrapper}>
      {/* Картка форми */}
      <div style={styles.card}>
        {/* Заголовок */}
        <h1 style={styles.title}>
          {isRegister ? AUTH_TEXT.register : AUTH_TEXT.login}
        </h1>

        {/* Повідомлення про помилку */}
        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorTitle}>{AUTH_TEXT.errorTitle}</span>

            <span style={styles.errorText}>{error}</span>
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email */}
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder={AUTH_TEXT.email}
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
          />

          {/* Пароль */}
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder={AUTH_TEXT.password}
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
            minLength={6}
          />

          {/* Поля реєстрації */}
          {isRegister && (
            <>
              {/* Ім’я */}
              <input
                style={styles.input}
                type="text"
                name="name"
                placeholder={AUTH_TEXT.name}
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                required
              />

              {/* Телефон */}
              <input
                style={styles.input}
                type="tel"
                name="phone"
                placeholder={AUTH_TEXT.phone}
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </>
          )}

          {/* Кнопка submit */}
          <button
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'default' : 'pointer',
              background: loading ? '#245F18' : '#2F7D1F',
            }}
            type="submit"
            disabled={loading}
          >
            {loading
              ? AUTH_TEXT.loading
              : isRegister
                ? AUTH_TEXT.registerButton
                : AUTH_TEXT.loginButton}
          </button>
        </form>

        {/* Перемикач форми */}
        <button
          style={styles.switchButton}
          onClick={handleModeSwitch}
          disabled={loading}
        >
          {isRegister ? AUTH_TEXT.switchToLogin : AUTH_TEXT.switchToRegister}
        </button>
      </div>
    </section>
  );
}

// Стилі
const styles = {
  // Wrapper сторінки
  wrapper: {
    width: '390px',
    minHeight: '600px',
    background: '#3B3940',
    padding: '40px 24px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Картка
  card: {
    width: '100%',
    background: '#1A1A1D',
    borderRadius: '18px',
    padding: '32px 24px',
    boxSizing: 'border-box',
  },

  // Заголовок
  title: {
    color: '#FFFFFF',
    fontSize: '24px',
    marginBottom: '24px',
    textAlign: 'center',
  },

  // Блок помилки
  errorBox: {
    background: '#3A1F1F',
    border: '1px solid #FF6B6B',
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  // Заголовок помилки
  errorTitle: {
    color: '#FF6B6B',
    fontSize: '12px',
    fontWeight: '700',
  },

  // Текст помилки
  errorText: {
    color: '#FFFFFF',
    fontSize: '13px',
    lineHeight: '18px',
  },

  // Форма
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  // Поля вводу
  input: {
    width: '100%',
    background: '#F2F2F2',
    border: '1px solid #2F7D1F',
    borderRadius: '14px',
    padding: '14px 16px',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: '0.2s ease',
  },

  // Кнопка submit
  submitButton: {
    width: '100%',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '16px',
    padding: '14px',
    fontSize: '14px',
    fontWeight: '600',
    marginTop: '8px',
    transition: '0.2s ease',
  },

  // Кнопка перемикання
  switchButton: {
    width: '100%',
    background: 'transparent',
    color: '#AAAAAA',
    border: 'none',
    padding: '12px',
    fontSize: '13px',
    cursor: 'pointer',
    marginTop: '16px',
    transition: '0.2s ease',
  },
};

export default LoginPage;
