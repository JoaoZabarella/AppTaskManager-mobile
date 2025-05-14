import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { log, logPretty } from '../utils/logger';

export const auth = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    log.group('AUTH SERVICE - Login');
    log.info('Iniciando processo de login');
    logPretty('Credenciais', { ...credentials, senha: '***' });
    
    try {
      const response = await api.post('/auth/login', credentials);
      log.success('Login realizado com sucesso');
      log.groupEnd();
      return response.data;
    } catch (error) {
      log.error('Falha no login', error);
      log.groupEnd();
      throw error;
    }
  }
};

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
      console.log('=== INICIANDO LOGIN ===');
      console.log('URL Base:', api.defaults.baseURL);
      console.log('Credenciais sendo enviadas:', credentials);
      
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      
      console.log('Login bem sucedido!');
      console.log('Token recebido:', response.data.token);
      
      await AsyncStorage.setItem('@TaskManager:token', response.data.token);
      console.log('Token salvo no AsyncStorage');
      
      api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
      
      return response.data;
    } catch (error: any) {
      console.error('=== ERRO NO LOGIN ===');
      console.error('Tipo de erro:', error.name);
      console.error('Mensagem:', error.message);
      
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        console.error('Headers:', error.response.headers);
        
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
        console.error('Request:', error.request);
        throw new Error('Servidor não está respondendo. Verifique a conexão.');
      } else {
        console.error('Erro de configuração:', error.message);
        throw new Error('Erro ao configurar requisição: ' + error.message);
      }
    }
  },

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('@TaskManager:token');
      delete api.defaults.headers.Authorization;
      console.log('Logout realizado, token removido');
    } catch (error) {
      console.error('Erro durante logout:', error);
      throw new Error('Erro ao fazer logout');
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('@TaskManager:token');
    } catch (error) {
      console.error('Erro ao buscar token:', error);
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
      console.error('Erro ao renovar token:', error);
      return false;
    }
  },
};