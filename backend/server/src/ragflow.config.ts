// Ragflow API 配置
export const RAGFLOW_CONFIG = {
  host: process.env.RAGFLOW_HOST || 'localhost',
  port: parseInt(process.env.RAGFLOW_PORT || '9380'),
  apiKey: process.env.RAGFLOW_API_KEY || 'ragflow-Y3MGU5NjVhN2QwZDExZjA4MjU3NmFkZj',
  timeout: parseInt(process.env.RAGFLOW_TIMEOUT || '30000'),
  retries: parseInt(process.env.RAGFLOW_RETRIES || '3'),
  get baseUrl() {
    return `http://${this.host}:${this.port}`;
  }
};

// 其他服务端口信息（用于调试和监控）
export const RAGFLOW_SERVICES = {
  mysql: {
    port: parseInt(process.env.RAGFLOW_MYSQL_PORT || '5455'),
    description: 'MySQL 数据库'
  },
  minio: {
    port: parseInt(process.env.RAGFLOW_MINIO_PORT || '9000'),
    description: 'MinIO 对象存储'
  },
  elasticsearch: {
    port: parseInt(process.env.RAGFLOW_ELASTICSEARCH_PORT || '1200'),
    description: 'Elasticsearch 搜索引擎'
  },
  redis: {
    port: parseInt(process.env.RAGFLOW_REDIS_PORT || '6379'),
    description: 'Redis 缓存'
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
  
  console.log(`🔧 Ragflow API 服务: ${RAGFLOW_CONFIG.host}:${RAGFLOW_CONFIG.port}`);
  console.log(`🌐 Web 界面: http://${RAGFLOW_CONFIG.host}:80`);
  console.log(`📊 服务端口信息:`);
  Object.entries(RAGFLOW_SERVICES).forEach(([service, config]) => {
    console.log(`   - ${config.description}: ${config.port}`);
  });
}
