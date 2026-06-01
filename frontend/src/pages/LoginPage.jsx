import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { register as registerApi } from '../services/authService';
import { AUTH_TEXT } from '../constants/uiText';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

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

  // Оновлення звичайних полів
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Відправка форми
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      // Реєстрація
      if (isRegister) {
        await registerApi(formData);
      }

      // Авторизація
      await login(formData.email, formData.password);

      // Перехід на головну
      navigate('/');
    } catch (err) {
      // Повідомлення з backend
      const message = err.response?.data?.message || AUTH_TEXT.defaultError;

      // Показ помилки
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      // Вимкнення loader
      setLoading(false);
    }
  };

  return (
    <section
      className="app-container"
      style={{ padding: '40px 20px', justifyContent: 'center' }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{ padding: '32px 24px' }}
      >
        {/* Логотип */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background:
                'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
        </div>

        {/* Заголовок */}
        <h1
          className="section-title"
          style={{
            fontSize: '24px',
            justifyContent: 'center',
            marginBottom: '8px',
          }}
        >
          {isRegister ? AUTH_TEXT.register : AUTH_TEXT.login}
        </h1>

        {/* Опис */}
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            marginBottom: '24px',
            fontSize: '14px',
          }}
        >
          {isRegister
            ? 'Приєднуйтесь до системи лояльності PointDrop'
            : 'Увійдіть у свій акаунт PointDrop'}
        </p>

        {/* Помилка */}
        {error && (
          <div
            className="notice-error"
            style={{
              background: 'var(--danger-light)',
              padding: '12px',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        {/* Форма */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {/* Email */}
          <input
            className="input-base"
            type="email"
            name="email"
            placeholder={AUTH_TEXT.email}
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
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
            disabled={loading}
            required
            minLength={6}
            style={{ marginBottom: 0 }}
          />

          {/* Поля реєстрації */}
          {isRegister && (
            <div
              className="animate-fade-in"
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {/* Ім’я */}
              <input
                className="input-base"
                type="text"
                name="name"
                placeholder={AUTH_TEXT.name}
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                required
                style={{ marginBottom: 0 }}
              />

              {/* Телефон */}
              <PhoneInput
                className="input-base"
                placeholder={AUTH_TEXT.phone}
                value={formData.phone}
                onChange={(value) =>
                  setFormData({ ...formData, phone: value || '' })
                }
                defaultCountry="UA"
                international
                countryCallingCodeEditable={false}
                disabled={loading}
                required
                style={{ marginBottom: 0 }}
              />
            </div>
          )}

          {/* Кнопка submit */}
          <button
            className="btn btn-primary btn-full"
            type="submit"
            disabled={loading}
            style={{ marginTop: '8px', padding: '14px' }}
          >
            {loading
              ? AUTH_TEXT.loading
              : isRegister
                ? AUTH_TEXT.registerButton
                : AUTH_TEXT.loginButton}
          </button>
        </form>

        {/* Перемикання режиму */}
        <button
          className="btn btn-ghost btn-full"
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
          disabled={loading}
          style={{ marginTop: '16px' }}
        >
          {isRegister ? AUTH_TEXT.switchToLogin : AUTH_TEXT.switchToRegister}
        </button>
      </div>
    </section>
  );
}

export default LoginPage;
