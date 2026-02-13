// Electron IPC API 类型定义

/**
 * 文件/文件夹节点接口
 */
export interface FileNode {
  id: string
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileNode[]
}

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

  /**
   * 获取所有提供商
   */
  getProviders: () => Promise<unknown>

  /**
   * 保存提供商列表
   */
  saveProviders: (providers: unknown[]) => Promise<unknown>

  /**
   * 读取 Markdown 文件内容
   */
  readMarkdownFile: (filePath: string) => Promise<string>

  /**
   * 保存 Markdown 文件内容
   */
  saveMarkdownFile: (filePath: string, content: string) => Promise<boolean>

  /**
   * 监听文件夹打开事件
   */
  onFolderOpened: (callback: (data: { folderPath: string; fileTree: FileNode[] }) => void) => void

  /**
   * 删除文件
   */
  deleteFile: (filePath: string) => Promise<boolean>

  /**
   * 重命名文件
   */
  renameFile: (oldPath: string, newPath: string) => Promise<boolean>

  /**
   * 新建文件
   */
  createFile: (filePath: string, content: string) => Promise<boolean>

  /**
   * 新建文件夹
   */
  createFolder: (folderPath: string) => Promise<boolean>

  /**
   * 保存图片文件
   */
  saveImage: (imageBuffer: Buffer, imagePath: string) => Promise<string>
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
