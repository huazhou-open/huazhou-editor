// Electron IPC API 类型定义

/**
 * Electron 预加载脚本暴露的 API
 */
export interface ElectronAPI {
  /**
   * 发送消息到主进程
   */
  sendMessage: (message: string) => void

  /**
   * 监听来自主进程的消息
   */
  onMessage: (callback: (message: string) => void) => void

  /**
   * 调用主进程方法并返回结果
   */
  invoke: (channel: string, ...args: unknown[]) => Promise<unknown>

  /**
   * 移除监听器
   */
  removeListener: (channel: string, callback: (...args: unknown[]) => void) => void

  /**
   * 监听来自主进程菜单的导航事件
   */
  onNavigate: (callback: (path: string) => void) => void
}

/**
 * 扩展 Window 接口，添加 electronAPI
 */
declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
