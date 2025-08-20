// Ragflow API 类型定义

export interface CreateDatasetRequest {
  name: string;
  description: string;
  embedding_model: string;
  permission: string;
  chunk_method: string;
  parser_config: {
    raptor: {
      use_raptor: boolean;
    };
  };
}

export interface CreateDatasetResponse {
  data: {
    id: string;
    name: string;
    description: string;
    status: string;
  };
  message: string;
  success: boolean;
}

export interface UploadDocumentsResponse {
  data: Array<{
    id: string;
    name: string;
    status: string;
  }>;
  message: string;
  success: boolean;
}

export interface ManageParsingRequest {
  document_ids: string[];
}

export interface SuccessSimpleResponse {
  message: string;
  success: boolean;
}

export interface CreateChatAssistantRequest {
  name: string;
  description: string;
  dataset_ids: string[];
  llm: {
    model_name: string;
    temperature: number;
    top_p: number;
  };
  prompt: {
    prompt: string;
    similarity_threshold: number;
    top_n: number;
    show_quote: boolean;
    empty_response: string;
  };
}

export interface ChatAssistantResponse {
  data: {
    id: string;
    name: string;
    status: string;
  };
  message: string;
  success: boolean;
}
