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
  }
});
