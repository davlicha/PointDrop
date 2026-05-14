import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { register } from '../services/authService';

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
      return 'Бекенд недоступний. Спробуйте пізніше.';
    }

    return 'Сталася помилка. Перевірте дані та спробуйте ще раз.';
  };

  // Відправка форми
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(formData);
      }

      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
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
      <div style={styles.card}>
        {/* Заголовок */}
        <h1 style={styles.title}>{isRegister ? 'Реєстрація' : 'Вхід'}</h1>

        {/* Повідомлення про помилку */}
        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorTitle}>Помилка</span>
            <span style={styles.errorText}>{error}</span>
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
            minLength={6}
          />

          {isRegister && (
            <>
              <input
                style={styles.input}
                type="text"
                name="name"
                placeholder="Ваше ім'я"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                required
              />

              <input
                style={styles.input}
                type="tel"
                name="phone"
                placeholder="Телефон (+380...)"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </>
          )}

          <button
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'default' : 'pointer',
            }}
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Завантаження...'
              : isRegister
                ? 'Зареєструватися'
                : 'Увійти'}
          </button>
        </form>

        {/* Перемикач форми */}
        <button
          style={styles.switchButton}
          onClick={handleModeSwitch}
          disabled={loading}
        >
          {isRegister
            ? 'Вже є акаунт? Увійти'
            : 'Немає акаунту? Зареєструватися'}
        </button>
      </div>
    </section>
  );
}

const styles = {
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

  card: {
    width: '100%',
    background: '#1A1A1D',
    borderRadius: '18px',
    padding: '32px 24px',
    boxSizing: 'border-box',
  },

  title: {
    color: '#FFFFFF',
    fontSize: '24px',
    marginBottom: '24px',
    textAlign: 'center',
  },

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

  errorTitle: {
    color: '#FF6B6B',
    fontSize: '12px',
    fontWeight: '700',
  },

  errorText: {
    color: '#FFFFFF',
    fontSize: '13px',
    lineHeight: '18px',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  input: {
    width: '100%',
    background: '#F2F2F2',
    border: 'none',
    borderRadius: '14px',
    padding: '14px 16px',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },

  submitButton: {
    width: '100%',
    background: '#2F7D1F',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '16px',
    padding: '14px',
    fontSize: '14px',
    fontWeight: '600',
    marginTop: '8px',
  },

  switchButton: {
    width: '100%',
    background: 'transparent',
    color: '#AAAAAA',
    border: 'none',
    padding: '12px',
    fontSize: '13px',
    cursor: 'pointer',
    marginTop: '16px',
  },
};

export default LoginPage;
