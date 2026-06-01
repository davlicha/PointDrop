import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
<<<<<<< HEAD
import { register } from '../services/authService';
import { AUTH_TEXT } from '../constants/uiText';
import Toast from '../components/Toast';
=======
import { register as registerApi } from '../services/authService';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
>>>>>>> 3fb98ba37b5792e35628134c07d90d6cf0f9610d

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

<<<<<<< HEAD
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
=======
>>>>>>> 3fb98ba37b5792e35628134c07d90d6cf0f9610d
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      // Реєстрація
      if (isRegister) {
        await registerApi(formData);
        // Після реєстрації автоматично логінимось
        await login(formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
<<<<<<< HEAD

      // Авторизація
      await login(formData.email, formData.password);

      // Перехід на головну
      navigate('/');
    } catch (err) {
      // Встановлення тексту помилки
      setError(getErrorMessage(err));
=======
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Помилка авторизації';
      setError(Array.isArray(message) ? message.join(', ') : message);
>>>>>>> 3fb98ba37b5792e35628134c07d90d6cf0f9610d
    } finally {
      // Вимкнення loader
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <section style={styles.wrapper}>
      {/* Картка форми */}
      <div style={styles.card}>
        {/* Заголовок */}
        <h1 style={styles.title}>
          {isRegister ? AUTH_TEXT.register : AUTH_TEXT.login}
        </h1>

        {/* Повідомлення про помилку */}
        {error && <Toast message={error} type="error" />}
        {/* Форма */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email */}
=======
    <section className="app-container" style={{ padding: '40px 20px', justifyContent: 'center' }}>
      <div className="glass-card animate-fade-in" style={{ padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ 
            width: '64px', height: '64px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          </div>
        </div>
        
        <h1 className="section-title" style={{ fontSize: '24px', justifyContent: 'center', marginBottom: '8px' }}>
          {isRegister ? 'Створити акаунт' : 'З поверненням'}
        </h1>
        
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>
          {isRegister ? 'Приєднуйтесь до системи лояльності PointDrop' : 'Увійдіть у свій акаунт PointDrop'}
        </p>

        {error && <div className="notice-error" style={{ background: 'var(--danger-light)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
>>>>>>> 3fb98ba37b5792e35628134c07d90d6cf0f9610d
          <input
            className="input-base"
            type="email"
            name="email"
            placeholder={AUTH_TEXT.email}
            value={formData.email}
            onChange={handleChange}
            required
            style={{ marginBottom: 0 }}
          />

          {/* Пароль */}
          <input
            className="input-base"
            type="password"
            name="password"
            placeholder={AUTH_TEXT.password}
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            style={{ marginBottom: 0 }}
          />

          {/* Поля реєстрації */}
          {isRegister && (
<<<<<<< HEAD
            <>
              {/* Ім’я */}
=======
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
>>>>>>> 3fb98ba37b5792e35628134c07d90d6cf0f9610d
              <input
                className="input-base"
                type="text"
                name="name"
                placeholder={AUTH_TEXT.name}
                value={formData.name}
                onChange={handleChange}
                required
                style={{ marginBottom: 0 }}
              />

<<<<<<< HEAD
              {/* Телефон */}
              <input
                style={styles.input}
                type="tel"
                name="phone"
                placeholder={AUTH_TEXT.phone}
=======
              <PhoneInput
                className="input-base"
                placeholder="Телефон"
>>>>>>> 3fb98ba37b5792e35628134c07d90d6cf0f9610d
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: value })}
                defaultCountry="UA"
                international
                countryCallingCodeEditable={false}
                required
                style={{ marginBottom: 0 }}
              />
            </div>
          )}

          {/* Кнопка submit */}
          <button
<<<<<<< HEAD
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'default' : 'pointer',
              background: loading ? '#245F18' : '#2F7D1F',
            }}
=======
            className="btn btn-primary btn-full"
>>>>>>> 3fb98ba37b5792e35628134c07d90d6cf0f9610d
            type="submit"
            disabled={loading}
            style={{ marginTop: '8px', padding: '14px' }}
          >
<<<<<<< HEAD
            {loading
              ? AUTH_TEXT.loading
              : isRegister
                ? AUTH_TEXT.registerButton
                : AUTH_TEXT.loginButton}
=======
            {loading ? 'Обробка...' : (isRegister ? 'Зареєструватися' : 'Увійти')}
>>>>>>> 3fb98ba37b5792e35628134c07d90d6cf0f9610d
          </button>
        </form>

        <button
          className="btn btn-ghost btn-full"
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
          style={{ marginTop: '16px' }}
        >
<<<<<<< HEAD
          {isRegister ? AUTH_TEXT.switchToLogin : AUTH_TEXT.switchToRegister}
=======
          {isRegister ? 'Вже є акаунт? Увійти' : 'Немає акаунту? Створити'}
>>>>>>> 3fb98ba37b5792e35628134c07d90d6cf0f9610d
        </button>
      </div>
    </section>
  );
}

<<<<<<< HEAD
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

=======
>>>>>>> 3fb98ba37b5792e35628134c07d90d6cf0f9610d
export default LoginPage;
