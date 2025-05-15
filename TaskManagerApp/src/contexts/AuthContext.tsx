import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import { userService, UserResponse } from '../services/usuarioService';
import api from '../services/api';

interface AuthContextData {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('@TaskManager:token');
      
      if (token) {
        
        api.defaults.headers.Authorization = `Bearer ${token}`;
        
        
        const userData = await userService.getProfile();
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      
      await AsyncStorage.removeItem('@TaskManager:token');
      delete api.defaults.headers.Authorization;
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, senha: string) => {
    try {
      console.log('Iniciando processo de login...');
      const { token } = await authService.login({ email, senha });
      
      
      await AsyncStorage.setItem('@TaskManager:token', token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      
      
      const userData = await userService.getProfile();
      setUser(userData);
      console.log('Login completo, usuário:', userData.nome);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      
      await AsyncStorage.removeItem('@TaskManager:token');
      delete api.defaults.headers.Authorization;
      setUser(null);
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await userService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated: !!user, 
        login, 
        logout,
        refreshUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};