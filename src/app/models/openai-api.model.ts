export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature: number;
  max_tokens: number;
}

export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export interface DallERequest {
  model: string;
  prompt: string;
  n: number;
  size: '1024x1024' | '1792x1024' | '1024x1792';
  quality: 'standard' | 'hd';
  response_format: 'url' | 'b64_json';
}

export interface DallEResponse {
  created: number;
  data: { url: string; revised_prompt?: string }[];
}
