import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example: send a message to main process
  sendMessage: (message: string) => ipcRenderer.send('message', message),

  // Example: receive a message from main process
  onMessage: (callback: (message: string) => void) => {
    ipcRenderer.on('message', (_event, message) => callback(message))
  },

  // Example: invoke a method in main process and get result
  invoke: (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args),

  // Example: remove listener
  removeListener: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.removeListener(channel, callback)
  },

  // Listen for navigation events from main process menu
  onNavigate: (callback: (path: string) => void) => {
    ipcRenderer.on('navigate', (_event, path) => callback(path))
  },

  // 模型配置相关
  getProviders: () => ipcRenderer.invoke('get-providers'),
  saveProviders: (providers: unknown[]) => ipcRenderer.invoke('save-providers', providers),

  // Markdown 编辑器相关
  readMarkdownFile: (filePath: string) => ipcRenderer.invoke('read-markdown-file', filePath),
  saveMarkdownFile: (filePath: string, content: string) => ipcRenderer.invoke('save-markdown-file', filePath, content),
  onFolderOpened: (callback: (data: { folderPath: string; files: string[] }) => void) => {
    ipcRenderer.on('folder-opened', (_event, data) => callback(data))
  },

  // 文件操作相关
  deleteFile: (filePath: string) => ipcRenderer.invoke('delete-file', filePath),
  renameFile: (oldPath: string, newPath: string) => ipcRenderer.invoke('rename-file', oldPath, newPath),
  createFile: (filePath: string, content: string) => ipcRenderer.invoke('create-file', filePath, content),
  createFolder: (folderPath: string) => ipcRenderer.invoke('create-folder', folderPath),

  // 图片操作相关
  saveImage: (imageBuffer: Buffer, imagePath: string) => ipcRenderer.invoke('save-image', imageBuffer, imagePath)
})

// Type declarations for the exposed API
declare global {
  interface Window {
    electronAPI: {
      sendMessage: (message: string) => void
      onMessage: (callback: (message: string) => void) => void
      invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
      removeListener: (channel: string, callback: (...args: unknown[]) => void) => void
      onNavigate: (callback: (path: string) => void) => void
      getProviders: () => Promise<unknown>
      saveProviders: (providers: unknown[]) => Promise<unknown>
      readMarkdownFile: (filePath: string) => Promise<string>
      saveMarkdownFile: (filePath: string, content: string) => Promise<boolean>
      onFolderOpened: (callback: (data: { folderPath: string; files: string[] }) => void) => void
      deleteFile: (filePath: string) => Promise<boolean>
      renameFile: (oldPath: string, newPath: string) => Promise<boolean>
      createFile: (filePath: string, content: string) => Promise<boolean>
      createFolder: (folderPath: string) => Promise<boolean>
      saveImage: (imageBuffer: Buffer, imagePath: string) => Promise<string>
    }
  }
}
