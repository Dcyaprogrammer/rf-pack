// 从 ragflow-swagger-0.19.ts 中提取需要的类型定义

export interface RaptorConfig {
  use_raptor?: boolean;
}

export interface GraphragConfig {
  use_graphrag?: boolean;
}

export interface ParserConfigNaive {
  auto_keywords?: number;
  auto_questions?: number;
  chunk_token_num?: number;
  delimiter?: string;
  html4excel?: boolean;
  layout_recognize?: string;
  tag_kb_ids?: string[];
  task_page_size?: number;
  raptor?: RaptorConfig;
  graphrag?: GraphragConfig;
}

export interface ParserConfigWithRaptor {
  raptor?: RaptorConfig;
}

export interface ParserConfigEmpty { 
  [key: string]: unknown 
}

export type ParserConfig = ParserConfigNaive | ParserConfigWithRaptor | ParserConfigEmpty;

export type CreateDatasetRequestPermission = 'me' | 'team';

export type CreateDatasetRequestChunkMethod = 
  | 'naive' | 'book' | 'email' | 'laws' | 'manual' | 'one' 
  | 'paper' | 'picture' | 'presentation' | 'qa' | 'table' | 'tag';

export interface CreateDatasetRequest {
  name: string;
  avatar?: string;
  description?: string;
  embedding_model?: string;
  permission?: CreateDatasetRequestPermission;
  chunk_method?: CreateDatasetRequestChunkMethod;
  parser_config?: ParserConfig;
}

export interface ManageParsingRequest {
  document_ids: string[];
}

export interface LlmConfig {
  model_name?: string;
  temperature?: number;
  top_p?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
}

export interface PromptVariable {
  key?: string;
  optional?: boolean;
}

export interface PromptConfig {
  similarity_threshold?: number;
  keywords_similarity_weight?: number;
  top_n?: number;
  variables?: PromptVariable[];
  rerank_model?: string;
  top_k?: number;
  empty_response?: string;
  opener?: string;
  show_quote?: boolean;
  prompt?: string;
}

export interface CreateChatAssistantRequest {
  name: string;
  avatar?: string;
  description?: string;
  dataset_ids?: string[];
  llm?: LlmConfig;
  prompt?: PromptConfig;
}

// 响应类型
export interface CreateDatasetResponse {
  code?: number;
  data?: {
    id?: string;
    name?: string;
    description?: string;
    permission?: string;
    avatar?: string;
    embedding_model?: string;
    chunk_method?: string;
    parser_config?: ParserConfig;
    status?: string;
    create_date?: string;
    update_date?: string;
    create_time?: number;
    update_time?: number;
    created_by?: string;
    tenant_id?: string;
    document_count?: number;
    chunk_count?: number;
    token_num?: number;
    language?: string;
    pagerank?: number;
    similarity_threshold?: number;
    vector_similarity_weight?: number;
  };
}

export interface UploadDocumentsResponse {
  code?: number;
  data?: Array<{
    id?: string;
    dataset_id?: string;
    location?: string;
    name?: string;
    type?: string;
    size?: number;
    thumbnail?: string;
    run?: string;
    chunk_method?: string;
    parser_config?: ParserConfig;
    created_by?: string;
  }>;
}

export interface SuccessSimpleResponse {
  code?: number;
}

export interface ChatAssistantResponse {
  code?: number;
  data?: {
    id?: string;
    name?: string;
    avatar?: string;
    description?: string;
    language?: string;
    llm?: LlmConfig;
    prompt?: PromptConfig;
    dataset_ids?: string[];
    status?: string;
    do_refer?: string;
    prompt_type?: string;
    tenant_id?: string;
    top_k?: number;
    create_date?: string;
    update_date?: string;
    create_time?: number;
    update_time?: number;
  };
}
