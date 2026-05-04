import api from './api';

/**
 * Отримання профілю поточного користувача
 */
export async function getCurrentUserProfile() {
  const response = await api.get('/auth/me');
  return response.data;
}
