// 配置相关类型定义

/**
 * AI 模型配置
 */
export interface ModelConfig {
  id: string
  name: string
  provider: string
  apiKey?: string
  apiEndpoint?: string
  isDefault: boolean
  maxTokens?: number
  temperature?: number
}

/**
 * 基础配置
 */
export interface BasicConfig {
  language: string
  dataPath: string
  autoSave: boolean
  autoSaveInterval: number // 秒
}

/**
 * 外观配置
 */
export interface AppearanceConfig {
  theme: 'light' | 'dark' | 'auto'
  fontSize: 'small' | 'default' | 'large'
  fontFamily: 'system' | 'microsoft-yahei' | 'pingfang' | 'source-han-sans'
  scale: '1.0' | '1.1' | '1.25' | '1.5'
}

/**
 * 应用配置总接口
 */
export interface AppConfig {
  models: ModelConfig[]
  basic: BasicConfig
  appearance: AppearanceConfig
}

/**
 * 设置菜单项
 */
export interface SettingsMenuItem {
  key: string
  label: string
  icon: string
}
