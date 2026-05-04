import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { register } from '../services/authService';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(formData);
        // Після реєстрації автоматично логінимось
        await login(formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Помилка авторизації';
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {isRegister ? 'Реєстрація' : 'Вхід'}
        </h1>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
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
                required
              />

              <input
                style={styles.input}
                type="tel"
                name="phone"
                placeholder="Телефон (+380...)"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </>
          )}

          <button
            style={styles.submitButton}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Завантаження...' : (isRegister ? 'Зареєструватися' : 'Увійти')}
          </button>
        </form>

        <button
          style={styles.switchButton}
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
        >
          {isRegister ? 'Вже є акаунт? Увійти' : 'Немає акаунту? Зареєструватися'}
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
    cursor: 'pointer',
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
  error: {
    color: '#FF6B6B',
    fontSize: '13px',
    marginBottom: '16px',
    textAlign: 'center',
  },
};

export default LoginPage;
