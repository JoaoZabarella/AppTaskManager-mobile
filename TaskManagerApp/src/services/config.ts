export const config = {
 
  NGROK_URL: 'https://9550-2804-14c-190-8ef0-d81c-faa1-c1fb-b80d.ngrok-free.app',
  
 
  API_BASE_URL: __DEV__ 
    ? 'https://9550-2804-14c-190-8ef0-d81c-faa1-c1fb-b80d.ngrok-free.app' 
    : 'https://api.taskmanager.com',
  

  TOKEN_KEY: '@TaskManager:token',
  USER_KEY: '@TaskManager:user',
  

  REQUEST_TIMEOUT: 30000,
  

  API_VERSION: 'v1',
};

export function getApiUrl() {
  return config.API_BASE_URL;
}