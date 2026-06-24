import axios from 'axios';

const envApiUrl = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:3000';

let API_URL = envApiUrl;

// Якщо ми на локальній мережі/localhost, використовуємо відносний шлях, 
// щоб Vite proxy перенаправляв запит на бекенд, уникаючи помилки Mixed Content (https -> http)
if (API_URL.includes('localhost')) {
  API_URL = '';
}

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Інтерсептор для додавання JWT токена до запитів
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Інтерсептор для обробки помилок авторизації
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Можна додати редірект на логін
    }
    return Promise.reject(error);
  }
);

export default api;
