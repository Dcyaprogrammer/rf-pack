// Ragflow 业务服务 - 业务逻辑层
import { RagflowClient } from '../lib/client';
import type {
  CreateDatasetRequest,
  ManageParsingRequest,
  CreateChatAssistantRequest
} from '../types';

export class RagflowFinancialService {
  private ragflowClient: RagflowClient;

  constructor(ragflowClient: RagflowClient) {
    this.ragflowClient = ragflowClient;
  }

  // 财报数据集配置
  private static readonly DATASET_CONFIG: CreateDatasetRequest = {
    name: "financial-reports-2024",
    description: "2024年度企业财报数据集，包含财务报表、经营分析、风险提示等关键信息",
    embedding_model: "maidalun1020/bce-embedding-base_v1@Youdao",
    permission: "me",
    chunk_method: "paper",
    parser_config: {
      raptor: {
        use_raptor: true
      }
    }
  };

  // 创建财报数据集
  async createDataset() {
    try {
      const response = await this.ragflowClient.createDataset(RagflowFinancialService.DATASET_CONFIG);
      console.log('财报数据集创建成功:', response.data);
      return response.data?.data?.id;
    } catch (error) {
      console.error('创建数据集失败:', error);
      throw error;
    }
  }

  // 上传财报文档
  async uploadReports(datasetId: string, pdfFiles: File[]) {
    try {
      const response = await this.ragflowClient.uploadDocuments(datasetId, { file: pdfFiles });
      console.log('财报文档上传成功:', response.data);
      return response.data?.data;
    } catch (error) {
      console.error('上传文档失败:', error);
      throw error;
    }
  }

  // 完整的设置流程
  async setupSystem(pdfFiles: File[]) {
    try {
      console.log('🚀 开始设置财报分析系统...');
      
      // 1. 创建数据集
      console.log('📊 创建财报数据集...');
      const datasetId = await this.createDataset();
      if (!datasetId) {
        throw new Error('创建数据集失败：未获取到数据集ID');
      }
      
      // 2. 上传财报文档
      console.log('📤 上传财报PDF文档...');
      const uploadedDocs = await this.uploadReports(datasetId, pdfFiles);
      const documentIds = uploadedDocs?.map(doc => doc.id).filter((id): id is string => Boolean(id)) || [];
      console.log('✅ 数据集创建与文件上传完成');
      console.log('📊 数据集ID:', datasetId);
      console.log('📄 文档IDs:', documentIds);

      return { datasetId, documentIds };
    } catch (error) {
      console.error('❌ 设置财报分析系统失败:', error);
      throw error;
    }
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    return this.ragflowClient.healthCheck();
  }

  // 获取数据集列表
  async listDatasets() {
    return this.ragflowClient.listDatasets();
  }

  // 获取文档列表
  async listDocuments(datasetId: string) {
    return this.ragflowClient.listDocuments(datasetId);
  }
}
