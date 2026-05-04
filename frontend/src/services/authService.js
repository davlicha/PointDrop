import api from './api';

/**
 * Реєстрація нового користувача
 */
export async function register({ email, password, name, phone }) {
  const response = await api.post('/auth/register', {
    email,
    password,
    name,
    phone,
  });
  return response.data;
}

/**
 * Авторизація користувача
 */
export async function login({ email, password }) {
  const response = await api.post('/auth/login', {
    email,
    password,
  });

  const { access_token } = response.data;

  // Зберігаємо токен у localStorage
  localStorage.setItem('access_token', access_token);

  return response.data;
}

/**
 * Вихід з системи
 */
export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
}

/**
 * Отримання QR-payload для показу QR-коду
 */
export async function getQrPayload() {
  const response = await api.get('/auth/qr-payload');
  return response.data;
}

/**
 * Перевірка чи користувач авторизований
 */
export function isAuthenticated() {
  return !!localStorage.getItem('access_token');
}

/**
 * Отримання токена
 */
export function getToken() {
  return localStorage.getItem('access_token');
}
