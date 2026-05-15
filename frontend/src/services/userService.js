import api from './api';

/**
 * Отримання профілю поточного користувача
 */
export async function getCurrentUserProfile() {
  const response = await api.get('/auth/me');
  return response.data;
}

/**
 * Пошук користувачів за номером телефону
 */
export async function searchUsers(phone, merchantId) {
  const response = await api.get('/users/search', {
    params: { phone, merchantId },
  });
  return response.data;
}

/**
 * Зробити поточного користувача мерчантом
 */
export async function makeMeMerchant() {
  const response = await api.post('/users/make-me-merchant');
  return response.data;
}
