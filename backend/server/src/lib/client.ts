// Ragflow 客户端 - 基础设施层
import axios, { AxiosResponse } from 'axios';
import { BaseHttpAdapter, BaseAdapterConfig } from './http/base-adapter';
import type {
  CreateDatasetRequest,
  CreateDatasetResponse,
  UploadDocumentsResponse,
  ManageParsingRequest,
  SuccessSimpleResponse,
  CreateChatAssistantRequest,
  ChatAssistantResponse
} from '../types';

export interface RagflowConfig extends BaseAdapterConfig {
  // 可以添加 Ragflow 特定的配置
}

export class RagflowClient extends BaseHttpAdapter {
  constructor(config: RagflowConfig) {
    super(config);
  }

  // 创建数据集
  async createDataset(request: CreateDatasetRequest): Promise<{ data: CreateDatasetResponse }> {
    return this.withRetry(async () => {
      const config = this.createRequestConfig();
      
      // 使用正确的 API 端点
      const endpoints = [
        '/api/v1/datasets',  // 主要端点
        '/api/v1/dataset',   // 备用端点
        '/datasets'           // 兼容性端点
      ];
      
      let lastError: any;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 尝试 API 端点: ${this.baseUrl}${endpoint}`);
          const response: AxiosResponse<CreateDatasetResponse> = await axios.post(
            `${this.baseUrl}${endpoint}`,
            request,
            config
          );
          console.log(`✅ 成功使用端点: ${endpoint}`);
          return { data: response.data };
        } catch (error: any) {
          lastError = error;
          console.log(`❌ 端点 ${endpoint} 失败: ${error.response?.status || error.message}`);
          continue;
        }
      }
      
      throw lastError || new Error('所有 API 端点都失败了');
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
        `${this.baseUrl}/api/v1/datasets/${datasetId}/documents`,
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
        `${this.baseUrl}/api/v1/datasets/${datasetId}/chunks`,
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
        `${this.baseUrl}/api/v1/chats`,
        request,
        config
      );
      return { data: response.data };
    });
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    const healthEndpoints = [
      '/health',
      '/api/health',
      '/v1/health',
      '/status'
    ];
    
    return super.healthCheck(healthEndpoints);
  }

  // 获取数据集列表
  async listDatasets(): Promise<any> {
    return this.withRetry(async () => {
      const config = this.createRequestConfig();
      const response = await axios.get(`${this.baseUrl}/api/v1/datasets`, config);
      return response.data;
    });
  }

  // 获取文档列表
  async listDocuments(datasetId: string): Promise<any> {
    return this.withRetry(async () => {
      const config = this.createRequestConfig();
      const response = await axios.get(`${this.baseUrl}/api/v1/datasets/${datasetId}/documents`, config);
      return response.data;
    });
  }
}
