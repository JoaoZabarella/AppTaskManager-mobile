// config.ts
export const config = {
  // URL do Ngrok - ATUALIZE COM SUA URL DO NGROK
  NGROK_URL: 'https://0179-2804-14c-190-8ef0-5761-c049-3ba3-2f00.ngrok-free.app',
  
  // URL da API baseada no ambiente
  API_BASE_URL: __DEV__ 
    ? ' https://0179-2804-14c-190-8ef0-5761-c049-3ba3-2f00.ngrok-free.app' 
    : 'https://api.taskmanager.com',
  
  // Chaves de armazenamento
  TOKEN_KEY: '@TaskManager:token',
  USER_KEY: '@TaskManager:user',
  
  // Timeouts
  REQUEST_TIMEOUT: 30000,
  
  // Versão da API
  API_VERSION: 'v1',
};

export function getApiUrl() {
  return config.API_BASE_URL;
}