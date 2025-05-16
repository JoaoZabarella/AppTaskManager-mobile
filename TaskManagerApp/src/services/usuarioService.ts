import api from './api';

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
  statusEmoji?: string;
}

export default {
  async registerUser(userData: RegisterRequest): Promise<UserResponse> {
    if (!userData.nome || !userData.email || !userData.senha || !userData.confirmaSenha) {
      throw new Error('Todos os campos são obrigatórios.');
    }

    if (userData.senha !== userData.confirmaSenha) {
      throw new Error('As senhas não coincidem.');
    }

    try {
      const response = await api.api.post<UserResponse>('/usuario', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Erro nos dados enviados. Verifique e tente novamente.');
      }
      throw error;
    }
  },

  async getProfile(): Promise<UserResponse> {
    try {
      const response = await api.api.get<UserResponse>('/usuario/me');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
  }
};