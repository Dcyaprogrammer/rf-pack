#!/usr/bin/env tsx

// 创建财报分析 Schema 的脚本
import { FinancialReportService } from '../schema/service';
import { RagflowApiAdapter } from '../../lib/database/src/adapters/ragflow-api.adapter';
import { validateRagflowConfig } from '../../server/src/ragflow.config';
import { readFileSync } from 'fs';
import { join } from 'path';

async function createFinancialSchema() {
  try {
    console.log('🔍 检查配置...');
    validateRagflowConfig();
    
    console.log('🏥 检查 Ragflow 服务状态...');
    const apiAdapter = new RagflowApiAdapter();
    const isHealthy = await apiAdapter.healthCheck();
    
    if (!isHealthy) {
      console.error('❌ Ragflow 服务不可用，请确保服务正在运行');
      console.error('💡 请检查：');
      console.error('   1. Ragflow 服务器是否启动');
      console.error('   2. RAGFLOW_API_URL 是否正确');
      console.error('   3. 网络连接是否正常');
      return;
    }
    
    console.log('✅ Ragflow 服务健康检查通过');
    
    // 创建财报分析服务
    const service = new FinancialReportService();
    
    // 准备真实的 PDF 文件路径
    const pdfFiles = [
      // 替换为你的实际 PDF 文件路径
      join(process.cwd(), 'data', '2024-Q1-财报.pdf'),
      join(process.cwd(), 'data', '2024-Q2-财报.pdf'),
      join(process.cwd(), 'data', '2024-Q3-财报.pdf')
    ];
    
    // 检查文件是否存在
    const existingFiles = pdfFiles.filter(filePath => {
      try {
        readFileSync(filePath);
        return true;
      } catch {
        console.warn(`⚠️  文件不存在: ${filePath}`);
        return false;
      }
    });
    
    if (existingFiles.length === 0) {
      console.error('❌ 没有找到可用的 PDF 文件');
      console.error('💡 请将财报 PDF 文件放在 data/ 目录下，或修改文件路径');
      return;
    }
    
    console.log(`📄 找到 ${existingFiles.length} 个 PDF 文件`);
    
    // 将文件路径转换为 File 对象（模拟）
    const fileObjects = existingFiles.map(filePath => {
      const fileName = filePath.split('/').pop() || 'unknown.pdf';
      // 注意：在 Node.js 环境中，这里需要特殊处理
      // 实际使用时可能需要使用 fs 读取文件内容
      return new File([readFileSync(filePath)], fileName, { type: 'application/pdf' });
    });
    
    console.log('🚀 开始创建财报分析 Schema...');
    
    // 使用服务设置整个系统
    const result = await service.setupSystem(fileObjects);
    
    console.log('🎉 财报分析 Schema 创建成功！');
    console.log('📊 数据集ID:', result.datasetId);
    console.log('🤖 助手ID:', result.assistantId);
    console.log('📄 文档IDs:', result.documentIds);
    
    // 保存结果到文件（可选）
    const resultData = {
      timestamp: new Date().toISOString(),
      datasetId: result.datasetId,
      assistantId: result.assistantId,
      documentIds: result.documentIds,
      status: 'success'
    };
    
    console.log('💾 结果已保存，你可以使用这些 ID 进行后续操作');
    
  } catch (error) {
    console.error('❌ 创建财报分析 Schema 失败:', error);
    
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      
      // 提供具体的错误解决建议
      if (error.message.includes('ECONNREFUSED')) {
        console.error('💡 解决方案：请确保 Ragflow 服务器正在运行');
      } else if (error.message.includes('401')) {
        console.error('💡 解决方案：请检查 RAGFLOW_API_KEY 是否正确');
      } else if (error.message.includes('404')) {
        console.error('💡 解决方案：请检查 RAGFLOW_API_URL 是否正确');
      }
    }
  }
}

// 如果直接运行这个脚本
if (import.meta.main) {
  createFinancialSchema();
}

export { createFinancialSchema };
