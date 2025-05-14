

interface SensitiveFields {
  senha?: string;
  password?: string;
  token?: string;
  confirmaSenha?: string;
  senhaAtual?: string;
  novaSenha?: string;
  authorization?: string;
}


export const sanitizeForLogging = (data: any): any => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sanitized = { ...data };
  const sensitiveKeys = [
    'senha', 
    'password', 
    'token', 
    'confirmaSenha',
    'senhaAtual',
    'novaSenha',
    'authorization',
    'Authorization'
  ];

  for (const key in sanitized) {
    if (sensitiveKeys.some(sensitiveKey => 
      key.toLowerCase().includes(sensitiveKey.toLowerCase())
    )) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeForLogging(sanitized[key]);
    }
  }

  return sanitized;
};

/**
 * Log seguro que remove informações sensíveis
 */
export const secureLog = (message: string, data?: any) => {
  if (!__DEV__) return; // Só loga em desenvolvimento
  
  console.log(message, data ? sanitizeForLogging(data) : '');
};

/**
 * Log de erro seguro
 */
export const secureError = (message: string, error: any) => {
  if (!__DEV__) return;
  
  const sanitizedError = {
    message: error.message,
    stack: error.stack,
    response: error.response ? sanitizeForLogging(error.response) : undefined,
    request: error.request ? sanitizeForLogging(error.request) : undefined,
  };
  
  console.error(message, sanitizedError);
};