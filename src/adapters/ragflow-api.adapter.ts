// Ragflow API 适配器
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RAGFLOW_CONFIG } from '../config/ragflow.config';
import type {
  CreateDatasetRequest,
  CreateDatasetResponse,
  UploadDocumentsResponse,
  ManageParsingRequest,
  SuccessSimpleResponse,
  CreateChatAssistantRequest,
  ChatAssistantResponse
} from '../types/ragflow_sim';

export class RagflowApiAdapter {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;
  private retries: number;

  constructor() {
    this.baseUrl = RAGFLOW_CONFIG.baseUrl;
    this.apiKey = RAGFLOW_CONFIG.apiKey;
    this.timeout = RAGFLOW_CONFIG.timeout;
    this.retries = RAGFLOW_CONFIG.retries;
  }

  // 创建 HTTP 请求配置
  private createRequestConfig(): AxiosRequestConfig {
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
  private async withRetry<T>(
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

  // 创建数据集
  async createDataset(request: CreateDatasetRequest): Promise<{ data: CreateDatasetResponse }> {
    return this.withRetry(async () => {
      const config = this.createRequestConfig();
      const response: AxiosResponse<CreateDatasetResponse> = await axios.post(
        `${this.baseUrl}/datasets`,
        request,
        config
      );
      return { data: response.data };
    });
  }

  // 上传文档
  async uploadDocuments(
    datasetId: string, 
    request: { file: File[] }
  ): Promise<{ data: UploadDocumentsResponse }> {
    return this.withRetry(async () => {
      const config = this.createRequestConfig();
      
      // 创建 FormData
      const formData = new FormData();
      request.file.forEach(file => {
        formData.append('file', file);
      });

      const response: AxiosResponse<UploadDocumentsResponse> = await axios.post(
        `${this.baseUrl}/datasets/${datasetId}/documents`,
        formData,
        {
          ...config,
          headers: {
            ...config.headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return { data: response.data };
    });
  }

  // 解析文档
  async parseDocuments(
    datasetId: string, 
    request: ManageParsingRequest
  ): Promise<{ data: SuccessSimpleResponse }> {
    return this.withRetry(async () => {
      const config = this.createRequestConfig();
      const response: AxiosResponse<SuccessSimpleResponse> = await axios.post(
        `${this.baseUrl}/datasets/${datasetId}/chunks`,
        request,
        config
      );
      return { data: response.data };
    });
  }

  // 创建聊天助手
  async createChatAssistant(
    request: CreateChatAssistantRequest
  ): Promise<{ data: ChatAssistantResponse }> {
    return this.withRetry(async () => {
      const config = this.createRequestConfig();
      const response: AxiosResponse<ChatAssistantResponse> = await axios.post(
        `${this.baseUrl}/chats`,
        request,
        config
      );
      return { data: response.data };
    });
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      const config = this.createRequestConfig();
      const response = await axios.get(`${this.baseUrl}/health`, config);
      return response.status === 200;
    } catch (error) {
      console.error('Ragflow 健康检查失败:', error);
      return false;
    }
  }

  // 获取数据集列表
  async listDatasets(): Promise<any> {
    return this.withRetry(async () => {
      const config = this.createRequestConfig();
      const response = await axios.get(`${this.baseUrl}/datasets`, config);
      return response.data;
    });
  }

  // 获取文档列表
  async listDocuments(datasetId: string): Promise<any> {
    return this.withRetry(async () => {
      const config = this.createRequestConfig();
      const response = await axios.get(`${this.baseUrl}/datasets/${datasetId}/documents`, config);
      return response.data;
    });
  }
}
