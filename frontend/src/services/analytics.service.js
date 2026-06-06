import api from './api';

export const getAnalyticsSummary = async (merchantId) => {
  const response = await api.get('/analytics/summary', {
    params: { merchantId },
  });
  return response.data;
};

export const getTransactionHistory = async (merchantId, query = {}) => {
  const response = await api.get('/analytics/transactions', {
    params: { merchantId, ...query },
  });
  return response.data;
};
