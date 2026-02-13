import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'

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
  preload: path.join(__dirname, '../preload'),
  configDir: path.join(process.cwd(), 'config'),
  configFile: path.join(process.cwd(), 'config', 'model.json')
}

// 确保 config 目录存在
if (!fs.existsSync(ROOT_PATH.configDir)) {
  fs.mkdirSync(ROOT_PATH.configDir, { recursive: true })
}

let win: BrowserWindow | null = null

// 发送导航消息到渲染进程
function navigateTo(path: string) {
  if (win) {
    win.webContents.send('navigate', path)
  }
}

// 读取配置文件
function loadConfig() {
  try {
    if (fs.existsSync(ROOT_PATH.configFile)) {
      const data = fs.readFileSync(ROOT_PATH.configFile, 'utf-8')
      const config = JSON.parse(data)
      console.log('Config loaded from:', config)
      return config.providers || []
    }
    console.log('Config file not found, returning empty array')
    return []
  } catch (error) {
    console.error('Error loading config:', error)
    return []
  }
}

// 保存配置文件
function saveConfig(providers: unknown[]) {
  try {
    const config = { providers }
    fs.writeFileSync(ROOT_PATH.configFile, JSON.stringify(config, null, 2), 'utf-8')
    console.log('Config saved to:', ROOT_PATH.configFile)
    return { success: true }
  } catch (error) {
    console.error('Error saving config:', error)
    return { success: false, error: String(error) }
  }
}

// IPC 处理器
// 获取所有提供商
ipcMain.handle('get-providers', () => {
  console.log('get-providers called')
  return loadConfig()
})

// 保存提供商列表
ipcMain.handle('save-providers', (_event, providers: unknown[]) => {
  console.log('save-providers called with:', providers)
  return saveConfig(providers)
})

// 创建应用菜单
function createMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: '文件',
      submenu: [
        {
          label: '打开文件夹',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog({
              properties: ['openDirectory'],
              title: '选择文件夹'
            })
            if (!result.canceled && result.filePaths.length > 0) {
              const folderPath = result.filePaths[0]
              const fileTree = await loadMarkdownFiles(folderPath)
              if (win) {
                win.webContents.send('folder-opened', {
                  folderPath,
                  fileTree
                })
              }
            }
          }
        },
        { type: 'separator' },
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

// 文件/文件夹节点接口
interface FileNode {
  id: string
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileNode[]
}

// 递归扫描文件夹
async function scanDirectory(dirPath: string): Promise<FileNode[]> {
  try {
    const entries = await promisify(fs.readdir)(dirPath, { withFileTypes: true } as never)
    const nodes: FileNode[] = []

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      const id = fullPath.replace(/\\/g, '/')

      if (entry.isDirectory()) {
        // 递归扫描子文件夹
        const children = await scanDirectory(fullPath)
        nodes.push({
          id,
          name: entry.name,
          path: fullPath,
          type: 'folder',
          children
        })
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        // 只包含 .md 文件
        nodes.push({
          id,
          name: entry.name,
          path: fullPath,
          type: 'file'
        })
      }
    }

    return nodes
  } catch (error) {
    console.error('Error scanning directory:', error)
    return []
  }
}

// 加载文件夹中的文件树
async function loadMarkdownFiles(folderPath: string): Promise<FileNode[]> {
  return scanDirectory(folderPath)
}

// 读取 Markdown 文件内容
ipcMain.handle('read-markdown-file', async (_event, filePath: string): Promise<string> => {
  try {
    console.log('Reading file:', filePath)
    const content = await promisify(fs.readFile)(filePath, 'utf-8')
    console.log('File read successfully, length:', content.length)
    return content
  } catch (error) {
    console.error('Error reading markdown file:', error)
    console.error('File path was:', filePath)
    return ''
  }
})

// 保存 Markdown 文件内容
ipcMain.handle('save-markdown-file', async (_event, filePath: string, content: string): Promise<boolean> => {
  try {
    await promisify(fs.writeFile)(filePath, content, 'utf-8')
    return true
  } catch (error) {
    console.error('Error saving markdown file:', error)
    return false
  }
})

// 删除文件
ipcMain.handle('delete-file', async (_event, filePath: string): Promise<boolean> => {
  try {
    await promisify(fs.unlink)(filePath)
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
})

// 重命名文件
ipcMain.handle('rename-file', async (_event, oldPath: string, newPath: string): Promise<boolean> => {
  try {
    await promisify(fs.rename)(oldPath, newPath)
    return true
  } catch (error) {
    console.error('Error renaming file:', error)
    return false
  }
})

// 新建文件
ipcMain.handle('create-file', async (_event, filePath: string, content: string = ''): Promise<boolean> => {
  try {
    await promisify(fs.writeFile)(filePath, content, 'utf-8')
    return true
  } catch (error) {
    console.error('Error creating file:', error)
    return false
  }
})

// 新建文件夹
ipcMain.handle('create-folder', async (_event, folderPath: string): Promise<boolean> => {
  try {
    await promisify(fs.mkdir)(folderPath, { recursive: true })
    return true
  } catch (error) {
    console.error('Error creating folder:', error)
    return false
  }
})

// 保存图片文件
ipcMain.handle('save-image', async (_event, imageBuffer: Buffer, imagePath: string): Promise<string> => {
  try {
    // 确保目录存在
    const dir = path.dirname(imagePath)
    if (!fs.existsSync(dir)) {
      await promisify(fs.mkdir)(dir, { recursive: true })
    }
    await promisify(fs.writeFile)(imagePath, imageBuffer)
    console.log('Image saved to:', imagePath)
    return imagePath
  } catch (error) {
    console.error('Error saving image:', error)
    throw error
  }
})

// Disable Hardware Acceleration for better compatibility
app.disableHardwareAcceleration()

// 禁用 GPU 加速
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-software-rasterizer')
app.commandLine.appendSwitch('disable-gpu-compositing')
app.commandLine.appendSwitch('no-sandbox')
app.commandLine.appendSwitch('in-process-gpu')
