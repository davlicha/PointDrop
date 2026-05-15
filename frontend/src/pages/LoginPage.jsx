import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { register as registerApi } from '../services/authService';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

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
        await registerApi(formData);
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
          <input
            className="input-base"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ marginBottom: 0 }}
          />

          <input
            className="input-base"
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            style={{ marginBottom: 0 }}
          />

          {isRegister && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                className="input-base"
                type="text"
                name="name"
                placeholder="Ваше ім'я"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ marginBottom: 0 }}
              />

              <PhoneInput
                className="input-base"
                placeholder="Телефон"
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

          <button
            className="btn btn-primary btn-full"
            type="submit"
            disabled={loading}
            style={{ marginTop: '8px', padding: '14px' }}
          >
            {loading ? 'Обробка...' : (isRegister ? 'Зареєструватися' : 'Увійти')}
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
          {isRegister ? 'Вже є акаунт? Увійти' : 'Немає акаунту? Створити'}
        </button>
      </div>
    </section>
  );
}

export default LoginPage;
