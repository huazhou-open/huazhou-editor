"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // Example: send a message to main process
  sendMessage: (message) => electron.ipcRenderer.send("message", message),
  // Example: receive a message from main process
  onMessage: (callback) => {
    electron.ipcRenderer.on("message", (_event, message) => callback(message));
  },
  // Example: invoke a method in main process and get result
  invoke: (channel, ...args) => electron.ipcRenderer.invoke(channel, ...args),
  // Example: remove listener
  removeListener: (channel, callback) => {
    electron.ipcRenderer.removeListener(channel, callback);
  },
  // Listen for navigation events from main process menu
  onNavigate: (callback) => {
    electron.ipcRenderer.on("navigate", (_event, path) => callback(path));
  },
  // 模型配置相关
  getProviders: () => electron.ipcRenderer.invoke("get-providers"),
  saveProviders: (providers) => electron.ipcRenderer.invoke("save-providers", providers),
  // Markdown 编辑器相关
  readMarkdownFile: (filePath) => electron.ipcRenderer.invoke("read-markdown-file", filePath),
  saveMarkdownFile: (filePath, content) => electron.ipcRenderer.invoke("save-markdown-file", filePath, content),
  onFolderOpened: (callback) => {
    electron.ipcRenderer.on("folder-opened", (_event, data) => callback(data));
  },
  // 文件操作相关
  deleteFile: (filePath) => electron.ipcRenderer.invoke("delete-file", filePath),
  renameFile: (oldPath, newPath) => electron.ipcRenderer.invoke("rename-file", oldPath, newPath),
  createFile: (filePath, content) => electron.ipcRenderer.invoke("create-file", filePath, content),
  createFolder: (folderPath) => electron.ipcRenderer.invoke("create-folder", folderPath),
  // 图片操作相关
  saveImage: (imageBuffer, imagePath) => electron.ipcRenderer.invoke("save-image", imageBuffer, imagePath)
});
