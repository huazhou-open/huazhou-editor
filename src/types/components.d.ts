// Vue 组件相关类型定义

/**
 * 基础组件 Props 类型
 */
export interface BaseComponentProps {
  id?: string
  class?: string
  style?: string | Record<string, string>
}

/**
 * 分页配置
 */
export interface PaginationConfig {
  currentPage: number
  pageSize: number
  total: number
}

/**
 * 表格列配置
 */
export interface TableColumn {
  prop: string
  label: string
  width?: number
  minWidth?: number
  align?: 'left' | 'center' | 'right'
  fixed?: boolean | 'left' | 'right'
}

/**
 * 表单规则
 */
export interface FormRule {
  required?: boolean
  message?: string
  trigger?: 'blur' | 'change' | string[]
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (rule: unknown, value: unknown, callback: (error?: Error) => void) => void
}

/**
 * 菜单项
 */
export interface MenuItem {
  id: string
  label: string
  icon?: string
  path?: string
  children?: MenuItem[]
  disabled?: boolean
}
