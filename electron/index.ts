import { app, BrowserWindow, Menu } from 'electron'
import path from 'path'

// The built directory structure
//
// ├─┬ out
// │ ├─┬ main
// │ │ └── index.js
// │ ├─┬ preload
// │ │ └── index.js
// │ └─┬ renderer
// │   └── index.html

const ROOT_PATH = {
  dist: path.join(__dirname, '../renderer'),
  preload: path.join(__dirname, '../preload')
}

let win: BrowserWindow | null = null

// 发送导航消息到渲染进程
function navigateTo(path: string) {
  if (win) {
    win.webContents.send('navigate', path)
  }
}

// 创建应用菜单
function createMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: '文件',
      submenu: [
        { role: 'quit', label: '退出' }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'selectAll', label: '全选' }
      ]
    },
    {
      label: '设置',
      submenu: [
        {
          label: '打开设置',
          accelerator: 'CmdOrCtrl+,',
          click: () => navigateTo('/settings')
        }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        { type: 'separator' },
        { role: 'toggleDevTools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '重置缩放' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        { role: 'about', label: '关于' }
      ]
    }
  ]

  // macOS 特殊处理：第一个菜单应该是应用名称
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about', label: '关于' },
        { type: 'separator' },
        { role: 'services', label: '服务' },
        { type: 'separator' },
        { role: 'hide', label: '隐藏' },
        { role: 'hideOthers', label: '隐藏其他' },
        { role: 'unhide', label: '显示全部' },
        { type: 'separator' },
        { role: 'quit', label: '退出' }
      ]
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(ROOT_PATH.preload, 'index.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    show: false
  })

  // Development mode: load from dev server
  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    // Production mode: load from built files
    win.loadFile(path.join(ROOT_PATH.dist, 'index.html'))
  }

  // Show window when ready to prevent visual flash
  win.once('ready-to-show', () => {
    win?.show()
  })
}

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  createMenu()
  createWindow()
})

// Disable Hardware Acceleration for better compatibility
app.disableHardwareAcceleration()
