export const config = {
 
  NGROK_URL: 'https://d98b-2804-14c-190-8ef0-4cc7-8f15-3f92-daa1.ngrok-free.app',
 
  API_BASE_URL: __DEV__ 
    ? 'https://d98b-2804-14c-190-8ef0-4cc7-8f15-3f92-daa1.ngrok-free.app' 
    : 'https://api.taskmanager.com',
  

  TOKEN_KEY: '@TaskManager:token',
  USER_KEY: '@TaskManager:user',
  

  REQUEST_TIMEOUT: 30000,
  

  API_VERSION: 'v1',
};

export function getApiUrl() {
  return config.API_BASE_URL;
}