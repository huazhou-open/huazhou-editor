"use strict";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
const util = require("util");
const ROOT_PATH = {
  dist: path.join(__dirname, "../renderer"),
  preload: path.join(__dirname, "../preload"),
  configDir: path.join(process.cwd(), "config"),
  configFile: path.join(process.cwd(), "config", "model.json")
};
if (!fs.existsSync(ROOT_PATH.configDir)) {
  fs.mkdirSync(ROOT_PATH.configDir, { recursive: true });
}
let win = null;
function navigateTo(path2) {
  if (win) {
    win.webContents.send("navigate", path2);
  }
}
function loadConfig() {
  try {
    if (fs.existsSync(ROOT_PATH.configFile)) {
      const data = fs.readFileSync(ROOT_PATH.configFile, "utf-8");
      const config = JSON.parse(data);
      console.log("Config loaded from:", config);
      return config.providers || [];
    }
    console.log("Config file not found, returning empty array");
    return [];
  } catch (error) {
    console.error("Error loading config:", error);
    return [];
  }
}
function saveConfig(providers) {
  try {
    const config = { providers };
    fs.writeFileSync(ROOT_PATH.configFile, JSON.stringify(config, null, 2), "utf-8");
    console.log("Config saved to:", ROOT_PATH.configFile);
    return { success: true };
  } catch (error) {
    console.error("Error saving config:", error);
    return { success: false, error: String(error) };
  }
}
electron.ipcMain.handle("get-providers", () => {
  console.log("get-providers called");
  return loadConfig();
});
electron.ipcMain.handle("save-providers", (_event, providers) => {
  console.log("save-providers called with:", providers);
  return saveConfig(providers);
});
function createMenu() {
  const template = [
    {
      label: "文件",
      submenu: [
        {
          label: "打开文件夹",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            const result = await electron.dialog.showOpenDialog({
              properties: ["openDirectory"],
              title: "选择文件夹"
            });
            if (!result.canceled && result.filePaths.length > 0) {
              const folderPath = result.filePaths[0];
              const fileTree = await loadMarkdownFiles(folderPath);
              if (win) {
                win.webContents.send("folder-opened", {
                  folderPath,
                  fileTree
                });
              }
            }
          }
        },
        { type: "separator" },
        { role: "quit", label: "退出" }
      ]
    },
    {
      label: "编辑",
      submenu: [
        { role: "undo", label: "撤销" },
        { role: "redo", label: "重做" },
        { type: "separator" },
        { role: "cut", label: "剪切" },
        { role: "copy", label: "复制" },
        { role: "paste", label: "粘贴" },
        { role: "selectAll", label: "全选" }
      ]
    },
    {
      label: "设置",
      submenu: [
        {
          label: "打开设置",
          accelerator: "CmdOrCtrl+,",
          click: () => navigateTo("/settings")
        }
      ]
    },
    {
      label: "视图",
      submenu: [
        { role: "reload", label: "重新加载" },
        { role: "forceReload", label: "强制重新加载" },
        { type: "separator" },
        { role: "toggleDevTools", label: "开发者工具" },
        { type: "separator" },
        { role: "resetZoom", label: "重置缩放" },
        { role: "zoomIn", label: "放大" },
        { role: "zoomOut", label: "缩小" },
        { type: "separator" },
        { role: "togglefullscreen", label: "全屏" }
      ]
    },
    {
      label: "帮助",
      submenu: [
        { role: "about", label: "关于" }
      ]
    }
  ];
  if (process.platform === "darwin") {
    template.unshift({
      label: electron.app.getName(),
      submenu: [
        { role: "about", label: "关于" },
        { type: "separator" },
        { role: "services", label: "服务" },
        { type: "separator" },
        { role: "hide", label: "隐藏" },
        { role: "hideOthers", label: "隐藏其他" },
        { role: "unhide", label: "显示全部" },
        { type: "separator" },
        { role: "quit", label: "退出" }
      ]
    });
  }
  const menu = electron.Menu.buildFromTemplate(template);
  electron.Menu.setApplicationMenu(menu);
}
function createWindow() {
  win = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(ROOT_PATH.preload, "index.js"),
      nodeIntegration: false,
      contextIsolation: true
    },
    show: false
  });
  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    win.loadFile(path.join(ROOT_PATH.dist, "index.html"));
  }
  win.once("ready-to-show", () => {
    win?.show();
  });
}
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
electron.app.whenReady().then(() => {
  createMenu();
  createWindow();
});
async function scanDirectory(dirPath) {
  try {
    const entries = await util.promisify(fs.readdir)(dirPath, { withFileTypes: true });
    const nodes = [];
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const id = fullPath.replace(/\\/g, "/");
      if (entry.isDirectory()) {
        const children = await scanDirectory(fullPath);
        nodes.push({
          id,
          name: entry.name,
          path: fullPath,
          type: "folder",
          children
        });
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        nodes.push({
          id,
          name: entry.name,
          path: fullPath,
          type: "file"
        });
      }
    }
    return nodes;
  } catch (error) {
    console.error("Error scanning directory:", error);
    return [];
  }
}
async function loadMarkdownFiles(folderPath) {
  return scanDirectory(folderPath);
}
electron.ipcMain.handle("read-markdown-file", async (_event, filePath) => {
  try {
    console.log("Reading file:", filePath);
    const content = await util.promisify(fs.readFile)(filePath, "utf-8");
    console.log("File read successfully, length:", content.length);
    return content;
  } catch (error) {
    console.error("Error reading markdown file:", error);
    console.error("File path was:", filePath);
    return "";
  }
});
electron.ipcMain.handle("save-markdown-file", async (_event, filePath, content) => {
  try {
    await util.promisify(fs.writeFile)(filePath, content, "utf-8");
    return true;
  } catch (error) {
    console.error("Error saving markdown file:", error);
    return false;
  }
});
electron.ipcMain.handle("delete-file", async (_event, filePath) => {
  try {
    await util.promisify(fs.unlink)(filePath);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
});
electron.ipcMain.handle("rename-file", async (_event, oldPath, newPath) => {
  try {
    await util.promisify(fs.rename)(oldPath, newPath);
    return true;
  } catch (error) {
    console.error("Error renaming file:", error);
    return false;
  }
});
electron.ipcMain.handle("create-file", async (_event, filePath, content = "") => {
  try {
    await util.promisify(fs.writeFile)(filePath, content, "utf-8");
    return true;
  } catch (error) {
    console.error("Error creating file:", error);
    return false;
  }
});
electron.ipcMain.handle("create-folder", async (_event, folderPath) => {
  try {
    await util.promisify(fs.mkdir)(folderPath, { recursive: true });
    return true;
  } catch (error) {
    console.error("Error creating folder:", error);
    return false;
  }
});
electron.ipcMain.handle("save-image", async (_event, imageBuffer, imagePath) => {
  try {
    const dir = path.dirname(imagePath);
    if (!fs.existsSync(dir)) {
      await util.promisify(fs.mkdir)(dir, { recursive: true });
    }
    await util.promisify(fs.writeFile)(imagePath, imageBuffer);
    console.log("Image saved to:", imagePath);
    return imagePath;
  } catch (error) {
    console.error("Error saving image:", error);
    throw error;
  }
});
electron.app.disableHardwareAcceleration();
electron.app.commandLine.appendSwitch("disable-gpu");
electron.app.commandLine.appendSwitch("disable-software-rasterizer");
electron.app.commandLine.appendSwitch("disable-gpu-compositing");
electron.app.commandLine.appendSwitch("no-sandbox");
electron.app.commandLine.appendSwitch("in-process-gpu");
