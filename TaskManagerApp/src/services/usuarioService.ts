import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { secureLog, secureError } from '../utils/secureLogger';

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  confirmaSenha: string;
}

export interface UserResponse {
  id: number;
  nome: string;
  email: string;
  dataCriacao: string;
  ativo: boolean;
  roles: string[];
  statusEmoji: string;
}

export interface UpdateUserRequest {
  nome?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  senhaAtual: string;
  novaSenha: string;
  confirmaSenha: string;
}

export const userService = {
  async registerUser(userData: RegisterRequest): Promise<UserResponse> {
    try {
      secureLog('=== INICIANDO REGISTRO ===');
      secureLog('Dados sendo enviados:', userData); 
      
      const response = await api.post<UserResponse>('/usuario', userData);
      
      console.log('Registro bem sucedido!');
      console.log('Usuário criado:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('=== ERRO NO REGISTRO ===');
      console.error('Tipo de erro:', error.name);
      console.error('Mensagem:', error.message);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Erro ao fazer registro';
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error('Request:', error.request);
        throw new Error('Servidor não está respondendo. Verifique a conexão.');
      } else {
        console.error('Erro de configuração:', error.message);
        throw new Error('Erro ao configurar requisição: ' + error.message);
      }
    }
  },

  async getProfile(): Promise<UserResponse> {
    try {
      const response = await api.get<UserResponse>('/usuario/me');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar perfil:', error);
      throw new Error('Erro ao buscar dados do usuário');
    }
  },

  async updateProfile(userData: UpdateUserRequest): Promise<UserResponse> {
    try {
      const response = await api.put<UserResponse>('/usuario/me', userData);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      throw new Error('Erro ao atualizar dados do usuário');
    }
  },

  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    try {
      await api.put('/usuario/me/alterar-senha', passwordData);
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      if (error.response?.status === 400) {
        throw new Error('Senha atual incorreta');
      }
      throw new Error('Erro ao alterar senha');
    }
  },

  async deactivateAccount(): Promise<void> {
    try {
      await api.delete('/usuario/me');
      
      await AsyncStorage.removeItem('@TaskManager:token');
    } catch (error: any) {
      console.error('Erro ao desativar conta:', error);
      throw new Error('Erro ao desativar conta');
    }
  },
};