import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_BASE_URL = ' https://9550-2804-14c-190-8ef0-d81c-faa1-c1fb-b80d.ngrok-free.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', 
  },
});


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