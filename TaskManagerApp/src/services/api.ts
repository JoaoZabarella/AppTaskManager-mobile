import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL do ngrok - atualize com sua URL atual
const API_BASE_URL = ' https://0179-2804-14c-190-8ef0-5761-c049-3ba3-2f00.ngrok-free.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', 
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@TaskManager:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Requisição:', config.method, config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    console.log('Resposta:', response.status);
    return response;
  },
  (error) => {
    console.error('Erro:', error.message);
    return Promise.reject(error);
  }
);

export default api;