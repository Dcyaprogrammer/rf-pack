#!/usr/bin/env tsx

// 简单的财报分析 Schema 创建示例
import { FinancialReportService } from '../schema/service';
import { RagflowApiAdapter } from '../adapters/ragflow-api.adapter';
import { readFileSync } from 'fs';
import { join } from 'path';

async function main() {
  try {
    console.log('🚀 开始创建财报分析 Schema...');
    
    // 1. 检查 Ragflow 服务状态
    const apiAdapter = new RagflowApiAdapter();
    const isHealthy = await apiAdapter.healthCheck();
    
    if (!isHealthy) {
      console.error('❌ Ragflow 服务不可用');
      return;
    }
    
    console.log('✅ Ragflow 服务正常');
    
    // 2. 创建财报分析服务
    const service = new FinancialReportService();
    
    // 3. 准备 PDF 文件（这里使用模拟文件，实际使用时替换为真实文件）
    const pdfFiles = [
      // 方式1：使用真实文件路径（推荐）
      // join(process.cwd(), 'data', '2024-Q1-财报.pdf'),
      // join(process.cwd(), 'data', '2024-Q2-财报.pdf'),
      
      // 方式2：创建模拟文件（用于测试）
      new File(['模拟PDF内容'], '2024-Q1-财报.pdf', { type: 'application/pdf' }),
      new File(['模拟PDF内容'], '2024-Q2-财报.pdf', { type: 'application/pdf' })
    ];
    
    console.log(`📄 准备上传 ${pdfFiles.length} 个文件`);
    
    // 4. 创建 Schema 和上传文件
    const result = await service.setupSystem(pdfFiles);
    
    console.log('🎉 成功创建财报分析 Schema！');
    console.log('📊 数据集ID:', result.datasetId);
    console.log('🤖 助手ID:', result.assistantId);
    console.log('📄 文档IDs:', result.documentIds);
    
    // 5. 后续操作示例
    console.log('\n💡 后续可以进行的操作：');
    console.log('   - 查询数据集状态');
    console.log('   - 与助手对话分析财报');
    console.log('   - 检索特定文档内容');
    console.log('   - 更新数据集配置');
    
  } catch (error) {
    console.error('❌ 操作失败:', error);
  }
}

// 运行主函数
main();
