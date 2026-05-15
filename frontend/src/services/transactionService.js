import api from './api';

/**
 * P2P переказ балів
 */
export async function transferPoints({ senderId, merchantId, receiverPhone, receiverId, amount }) {
  const response = await api.post('/transactions/transfer', {
    senderId: senderId || import.meta.env.VITE_DEMO_SENDER_ID,
    merchantId: merchantId || import.meta.env.VITE_DEMO_MERCHANT_ID,
    receiverPhone,
    receiverId,
    amount: Number(amount),
  });

  return response.data;
}

/**
 * Нарахування балів (EARN) — використовується касиром/мерчантом
 */
export async function earnPoints({ qrPayload, merchantId, amountSpent }) {
  const response = await api.post('/transactions/earn', {
    qrPayload,
    merchantId: merchantId || import.meta.env.VITE_DEMO_MERCHANT_ID,
    amountSpent: Number(amountSpent),
  });

  return response.data;
}

/**
 * Списання балів (REDEEM)
 */
export async function redeemPoints({ userId, merchantId, requestedPoints }) {
  const response = await api.post('/transactions/redeem', {
    userId,
    merchantId: merchantId || import.meta.env.VITE_DEMO_MERCHANT_ID,
    requestedPoints: Number(requestedPoints),
  });

  return response.data;
}

/**
 * Отримання списку транзакцій
 */
export async function getMyTransactions() {
  const response = await api.get('/transactions/me');
  return response.data;
}
