// 全局类型定义

/**
 * 通用响应结构
 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/**
 * 分页响应
 */
export interface PageResponse<T = unknown> {
  list: T[]
  total: number
  currentPage: number
  pageSize: number
}

/**
 * ID 类型
 */
export type ID = string | number

/**
 * 可选的 Partial 深度版本
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * 提取函数参数类型
 */
export type Parameters<T> = T extends (...args: infer P) => unknown ? P : never

/**
 * 提取函数返回类型
 */
export type ReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never

/**
 * 使部分属性必需
 */
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * 日期范围
 */
export interface DateRange {
  start: Date
  end: Date
}

/**
 * 文件信息
 */
export interface FileInfo {
  name: string
  size: number
  type: string
  lastModified: number
  url?: string
}
