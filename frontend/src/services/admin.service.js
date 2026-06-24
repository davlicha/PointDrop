import api from './api.js';

export async function getMerchantUsers(merchantId) {
  const response = await api.get(`/users/merchant-users/${merchantId}`);
  return response.data;
}

export async function updateUserRole(userId, role) {
  const response = await api.patch(`/users/${userId}/role`, { role });
  return response.data;
}

export async function updateUserBalance(userId, merchantId, newBalance) {
  const response = await api.patch(`/users/${userId}/balance`, {
    merchantId,
    balance: Number(newBalance)
  });
  return response.data;
}
