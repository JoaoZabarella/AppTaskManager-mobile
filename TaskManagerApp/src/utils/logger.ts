

const isDev = __DEV__;

export const log = {
  debug: (message: string, ...args: any[]) => {
    if (isDev) {
      console.log(`🔍 [DEBUG] ${message}`, ...args);
    }
  },
  
  info: (message: string, ...args: any[]) => {
    if (isDev) {
      console.info(`ℹ️ [INFO] ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (isDev) {
      console.warn(`⚠️ [WARN] ${message}`, ...args);
    }
  },
  
  error: (message: string, ...args: any[]) => {
    // Errors sempre são logados, mesmo em produção, para debugging
    console.error(`❌ [ERROR] ${message}`, ...args);
  },
  
  success: (message: string, ...args: any[]) => {
    if (isDev) {
      console.log(`✅ [SUCCESS] ${message}`, ...args);
    }
  },
  
  // Método especial para logs de API
  api: (method: string, url: string, data?: any) => {
    if (isDev) {
      console.log(`🌐 [API] ${method} ${url}`, data || '');
    }
  },
  
  // Método para medir performance
  time: (label: string) => {
    if (isDev) {
      console.time(`⏱️ [TIME] ${label}`);
    }
  },
  
  timeEnd: (label: string) => {
    if (isDev) {
      console.timeEnd(`⏱️ [TIME] ${label}`);
    }
  },
  
  // Método para agrupar logs
  group: (label: string) => {
    if (isDev) {
      console.group(`📁 ${label}`);
    }
  },
  
  groupEnd: () => {
    if (isDev) {
      console.groupEnd();
    }
  },
  
  // Método para tabelas
  table: (data: any) => {
    if (isDev) {
      console.table(data);
    }
  }
};

// Desabilita console.log direto em produção
if (!isDev) {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.debug = () => {};
  // console.error continua funcionando para debugging crítico
}

// Helper para formatar objetos grandes
export const logPretty = (label: string, obj: any) => {
  if (isDev) {
    console.log(`📋 [${label}]`, JSON.stringify(obj, null, 2));
  }
};

// Logger específico para debug de estado
export const logState = (componentName: string, state: any) => {
  if (isDev) {
    console.log(`🔄 [STATE: ${componentName}]`, state);
  }
};

// Logger para rastreamento de renderização
export const logRender = (componentName: string) => {
  if (isDev) {
    console.log(`🎨 [RENDER] ${componentName} rendered at ${new Date().toISOString()}`);
  }
};

// Logger para ações do usuário
export const logAction = (action: string, details?: any) => {
  if (isDev) {
    console.log(`👤 [ACTION] ${action}`, details || '');
  }
};