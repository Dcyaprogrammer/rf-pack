// Ragflow 业务服务 - 业务逻辑层
import { RagflowClient } from '../../lib/external/ragflow/ragflow-client';
import type {
  CreateDatasetRequest,
  ManageParsingRequest,
  CreateChatAssistantRequest
} from '../../lib/external/ragflow/types';

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

  // 解析文档
  async parseReports(datasetId: string, documentIds: string[]) {
    try {
      const parseRequest: ManageParsingRequest = {
        document_ids: documentIds
      };
      const response = await this.ragflowClient.parseDocuments(datasetId, parseRequest);
      console.log('财报文档解析开始:', response.data);
      return response;
    } catch (error) {
      console.error('解析文档失败:', error);
      throw error;
    }
  }

  // 创建分析助手
  async createAssistant(datasetIds: string[]) {
    try {
      const assistantConfig: CreateChatAssistantRequest = {
        name: "财报分析专家",
        description: "专业的财报分析助手，能够解读财务报表、分析经营状况、识别风险点",
        dataset_ids: datasetIds,
        llm: {
          model_name: "deepseek-chat@Deepseek",
          temperature: 0.3,
          top_p: 0.9
        },
        prompt: {
          prompt: `你是一位专业的财务分析师，专门负责解读和分析企业财报。

请基于提供的财报信息，帮助用户：
1. 分析财务报表的关键指标
2. 解读经营状况和趋势
3. 识别潜在风险和机会
4. 提供投资建议和决策支持

请确保回答准确、专业，并基于财报数据提供具体分析。`,
          similarity_threshold: 0.7,
          top_n: 5,
          show_quote: true,
          empty_response: "抱歉，我在财报中没有找到相关信息，请检查查询内容或提供更多上下文。"
        }
      };

      const response = await this.ragflowClient.createChatAssistant(assistantConfig);
      console.log('财报分析助手创建成功:', response.data);
      return response.data?.data?.id;
    } catch (error) {
      console.error('创建助手失败:', error);
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
      
      // 3. 解析文档
      console.log('🔍 开始解析财报文档...');
      await this.parseReports(datasetId, documentIds);
      
      // 4. 创建分析助手
      console.log('🤖 创建财报分析助手...');
      const assistantId = await this.createAssistant([datasetId]);
      
      console.log('✅ 财报分析系统设置完成！');
      console.log('📊 数据集ID:', datasetId);
      console.log('🤖 助手ID:', assistantId);
      
      return { datasetId, assistantId, documentIds };
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
