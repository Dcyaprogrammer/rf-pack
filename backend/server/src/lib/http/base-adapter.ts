// 基础 HTTP 适配器
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface BaseAdapterConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
  retries?: number;
}

export abstract class BaseHttpAdapter {
  protected baseUrl: string;
  protected apiKey?: string;
  protected timeout: number;
  protected retries: number;

  constructor(config: BaseAdapterConfig) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.timeout = config.timeout || 30000;
    this.retries = config.retries || 3;
  }

  // 创建 HTTP 请求配置
  protected createRequestConfig(): AxiosRequestConfig {
    const config: AxiosRequestConfig = {
      timeout: this.timeout,
      headers: {}
    };

    if (this.apiKey) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${this.apiKey}`
      };
    }

    return config;
  }

  // 重试机制
  protected async withRetry<T>(
    operation: () => Promise<T>,
    retryCount: number = this.retries
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      if (retryCount > 0 && this.isRetryableError(error)) {
        console.log(`API 调用失败，重试中... (剩余重试次数: ${retryCount - 1})`);
        await this.delay(1000 * (this.retries - retryCount + 1)); // 指数退避
        return this.withRetry(operation, retryCount - 1);
      }
      throw error;
    }
  }

  // 判断是否可重试的错误
  private isRetryableError(error: any): boolean {
    return (
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ECONNABORTED' ||
      (error.response && error.response.status >= 500) ||
      (error.response && error.response.status === 429)
    );
  }

  // 延迟函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 健康检查
  protected async healthCheck(endpoints: string[]): Promise<boolean> {
    try {
      const config = this.createRequestConfig();
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 尝试健康检查端点: ${this.baseUrl}${endpoint}`);
          const response = await axios.get(`${this.baseUrl}${endpoint}`, config);
          console.log(`✅ 健康检查成功: ${endpoint} (状态: ${response.status})`);
          return response.status === 200;
        } catch (error: any) {
          console.log(`❌ 健康检查端点 ${endpoint} 失败: ${error.response?.status || error.message}`);
          continue;
        }
      }
      
      console.error('❌ 所有健康检查端点都失败了');
      return false;
    } catch (error) {
      console.error('健康检查失败:', error);
      return false;
    }
  }
}
