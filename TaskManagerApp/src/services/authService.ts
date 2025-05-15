import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { secureLog, secureError } from '../utils/secureLogger';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      secureLog('=== INICIANDO LOGIN ===');
      secureLog('URL Base:', api.defaults.baseURL);
      secureLog('Email:', credentials.email);
      
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      
      secureLog('Login bem sucedido!');
      secureLog('Token recebido:', { token: '***TOKEN_RECEIVED***' });
      
      
      await AsyncStorage.setItem('@TaskManager:token', response.data.token);
      secureLog('Token salvo no AsyncStorage');
      
     
      api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
      
      return response.data;
    } catch (error: any) {
      secureError('=== ERRO NO LOGIN ===', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.details?.motivo ||
                           error.response.data?.error || 
                           'Erro ao fazer login';
        
        if (error.response.status === 401) {
          if (error.response.data?.details?.motivo?.includes('credenciais')) {
            throw new Error('Email ou senha inválidos');
          }
          throw new Error('Credenciais inválidas');  
        } else if (error.response.status === 403) {
          throw new Error('Usuário inativo');  
        } else if (error.response.status === 404) {
          throw new Error('Este email não foi cadastrado ainda');
        } else if (error.response.status === 400) {
          throw new Error(errorMessage);
        } else {
          throw new Error(`Erro no servidor: ${errorMessage}`);
        }
      } else if (error.request) {
        secureError('Request:', error.request);
        throw new Error('Servidor não está respondendo. Verifique a conexão.');
      } else {
        secureError('Erro de configuração:', error.message);
        throw new Error('Erro ao configurar requisição: ' + error.message);
      }
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('@TaskManager:token');
    } catch (error) {
      secureError('Erro ao buscar token:', error);
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  },

  async refreshToken(): Promise<boolean> {
    try {
      const token = await this.getToken();
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        return true;
      }
      return false;
    } catch (error) {
      secureError('Erro ao renovar token:', error);
      return false;
    }
  },
};