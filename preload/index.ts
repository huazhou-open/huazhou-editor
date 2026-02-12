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
  }
})

// Type declarations for the exposed API
declare global {
  interface Window {
    electronAPI: {
      sendMessage: (message: string) => void
      onMessage: (callback: (message: string) => void) => void
      invoke: (channel: string, ...args: unknown[]) => Promise<unknown>
      removeListener: (channel: string, callback: (...args: unknown[]) => void) => void
    }
  }
}
