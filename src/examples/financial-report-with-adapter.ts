// 使用适配器的财报分析服务示例
import { FinancialReportService } from '../schema/service';
import { RagflowApiAdapter } from '../adapters/ragflow-api.adapter';

async function main() {
  try {
    // 首先检查 Ragflow 服务是否可用
    const apiAdapter = new RagflowApiAdapter();
    const isHealthy = await apiAdapter.healthCheck();
    
    if (!isHealthy) {
      console.error('❌ Ragflow 服务不可用，请检查服务状态');
      return;
    }
    
    console.log('✅ Ragflow 服务健康检查通过');
    
    // 创建财报分析服务
    const service = new FinancialReportService();
    
    // 模拟财报PDF文件（在实际使用中，这些应该是真实的PDF文件）
    const pdfFiles = [
      new File([''], '2024-Q1-财报.pdf'),
      new File([''], '2024-Q2-财报.pdf'),
      new File([''], '2024-Q3-财报.pdf')
    ];
    
    console.log('🚀 开始设置财报分析系统...');
    
    // 使用服务设置整个系统
    const { datasetId, assistantId, documentIds } = await service.setupSystem(pdfFiles);
    
    console.log('🎉 系统设置完成！');
    console.log('📊 数据集ID:', datasetId);
    console.log('🤖 助手ID:', assistantId);
    console.log('📄 文档IDs:', documentIds);
    
    // 可以继续添加更多功能，比如：
    // - 查询数据集状态
    // - 与助手对话
    // - 检索文档内容等
    
  } catch (error) {
    console.error('❌ 系统设置失败:', error);
  }
}

// 如果直接运行这个文件
if (import.meta.main) {
  main();
}

export { main as runFinancialReportWithAdapter };
