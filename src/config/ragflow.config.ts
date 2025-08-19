// Ragflow API 配置
export const RAGFLOW_CONFIG = {
  host: process.env.RAGFLOW_HOST || 'localhost',
  port: parseInt(process.env.RAGFLOW_PORT || '8000'),
  apiKey: process.env.RAGFLOW_API_KEY || '',
  timeout: parseInt(process.env.RAGFLOW_TIMEOUT || '30000'),
  retries: parseInt(process.env.RAGFLOW_RETRIES || '3'),
  get baseUrl() {
    return `http://${this.host}:${this.port}`;
  }
};

// 环境检查
export function validateRagflowConfig() {
  if (!RAGFLOW_CONFIG.host) {
    throw new Error('RAGFLOW_HOST 环境变量未设置');
  }
  if (!RAGFLOW_CONFIG.port || isNaN(RAGFLOW_CONFIG.port)) {
    throw new Error('RAGFLOW_PORT 环境变量未设置或格式错误');
  }
  if (!RAGFLOW_CONFIG.apiKey) {
    console.warn('RAGFLOW_API_KEY 环境变量未设置，某些功能可能受限');
  }
  
  console.log(`🔧 Ragflow 配置: ${RAGFLOW_CONFIG.host}:${RAGFLOW_CONFIG.port}`);
}
