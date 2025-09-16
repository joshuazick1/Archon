export interface AgentMetadata {
  provider: 'openai' | 'anthropic' | 'google' | 'local';
  model: string;
  permissions: string[];
  temperature?: number;
  maxTokens?: number;
  customSettings?: Record<string, any>;
}

export interface AgentFile {
  id: string;
  name: string;
  path: string;
  type: 'agent' | 'subagent' | 'command';
  description: string;
  content: string;
  metadata: AgentMetadata;
  lastModified?: Date;
  size?: number;
}

export interface ProviderConfig {
  name: string;
  models: string[];
  defaultModel: string;
  supportsTemperature: boolean;
  supportsMaxTokens: boolean;
  customFields?: Array<{
    name: string;
    type: 'text' | 'number' | 'boolean' | 'select';
    label: string;
    options?: string[];
    required?: boolean;
  }>;
}

export const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  openai: {
    name: 'OpenAI',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4',
    supportsTemperature: true,
    supportsMaxTokens: true,
  },
  anthropic: {
    name: 'Anthropic',
    models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    defaultModel: 'claude-3-sonnet-20240229',
    supportsTemperature: true,
    supportsMaxTokens: true,
  },
  google: {
    name: 'Google',
    models: ['gemini-pro', 'gemini-pro-vision'],
    defaultModel: 'gemini-pro',
    supportsTemperature: true,
    supportsMaxTokens: true,
  },
  local: {
    name: 'Local Model',
    models: ['custom-model'],
    defaultModel: 'custom-model',
    supportsTemperature: false,
    supportsMaxTokens: false,
    customFields: [
      {
        name: 'endpoint',
        type: 'text',
        label: 'API Endpoint',
        required: true,
      },
      {
        name: 'apiKey',
        type: 'text',
        label: 'API Key',
        required: false,
      },
    ],
  },
};

export const COMMON_PERMISSIONS = [
  'read',
  'write',
  'execute',
  'network',
  'filesystem',
  'git',
  'shell',
  'api',
] as const;

export type Permission = typeof COMMON_PERMISSIONS[number];