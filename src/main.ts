import { app, BrowserWindow, Menu, dialog, ipcMain, IpcMainEvent } from 'electron';
import * as path from 'path';
import { promises as fs } from 'fs';

let mainWindow: BrowserWindow | null = null;
let currentFilePath: string | null = null;
let isUnsaved = false;

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        backgroundColor: '#ffffff',
        titleBarStyle: 'default',
        show: false
    });

    // __dirname points to dist/ after compilation
    // index.html is copied to dist/ by the build process
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Initialize menu
    createMenu();
}

// Handle unsaved changes prompt on app quit
app.on('before-quit', async (e: any) => {
    if (isUnsaved && mainWindow) {
        e.preventDefault();
        const result = await showUnsavedDialog();
        if (result === 'save') {
            await saveFile();
            app.quit();
        } else if (result === 'dont-save') {
            isUnsaved = false;
            app.quit();
        }
    }
});

function createMenu(): void {
    const template: any = [
        {
            label: '文件',
            submenu: [
                {
                    label: '新建',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => newFile()
                },
                {
                    label: '打开...',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => openFile()
                },
                {
                    label: '保存',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => saveFile()
                },
                {
                    label: '另存为...',
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click: () => saveFileAs()
                },
                { type: 'separator' },
                {
                    label: '退出',
                    accelerator: 'CmdOrCtrl+Q',
                    role: 'quit'
                }
            ]
        },
        {
            label: '编辑',
            submenu: [
                { label: '撤销', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
                { label: '重做', accelerator: 'CmdOrCtrl+Y', role: 'redo' },
                { type: 'separator' },
                { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
                { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
                { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
                { label: '全选', accelerator: 'CmdOrCtrl+A', role: 'selectall' },
                { type: 'separator' },
                {
                    label: '查找',
                    accelerator: 'CmdOrCtrl+F',
                    click: () => mainWindow?.webContents.send('editor-find')
                },
                {
                    label: '替换',
                    accelerator: 'CmdOrCtrl+H',
                    click: () => mainWindow?.webContents.send('editor-replace')
                }
            ]
        },
        {
            label: '视图',
            submenu: [
                {
                    label: '切换全屏',
                    accelerator: 'F11',
                    click: () => mainWindow?.setFullScreen(!!mainWindow?.isFullScreen())
                },
                {
                    label: '缩小',
                    accelerator: 'CmdOrCtrl+-',
                    click: () => mainWindow?.webContents.send('editor-zoom', { level: -1 })
                },
                {
                    label: '放大',
                    accelerator: 'CmdOrCtrl+=',
                    click: () => mainWindow?.webContents.send('editor-zoom', { level: 1 })
                },
                {
                    label: '重置缩放',
                    accelerator: 'CmdOrCtrl+0',
                    click: () => mainWindow?.webContents.send('editor-zoom', { level: 0 })
                },
                { type: 'separator' },
                {
                    label: '开发者工具',
                    accelerator: 'F12',
                    click: () => mainWindow?.webContents.toggleDevTools()
                }
            ]
        },
        {
            label: '格式',
            submenu: [
                {
                    label: '粗体',
                    accelerator: 'CmdOrCtrl+B',
                    click: () => mainWindow?.webContents.send('format-bold')
                },
                {
                    label: '斜体',
                    accelerator: 'CmdOrCtrl+I',
                    click: () => mainWindow?.webContents.send('format-italic')
                },
                {
                    label: '删除线',
                    accelerator: 'CmdOrCtrl+D',
                    click: () => mainWindow?.webContents.send('format-strikethrough')
                },
                { type: 'separator' },
                {
                    label: '标题 1',
                    click: () => mainWindow?.webContents.send('format-heading', { level: 1 })
                },
                {
                    label: '标题 2',
                    click: () => mainWindow?.webContents.send('format-heading', { level: 2 })
                },
                {
                    label: '标题 3',
                    click: () => mainWindow?.webContents.send('format-heading', { level: 3 })
                },
                { type: 'separator' },
                {
                    label: '代码块',
                    click: () => mainWindow?.webContents.send('format-code')
                },
                {
                    label: '引用',
                    click: () => mainWindow?.webContents.send('format-quote')
                },
                {
                    label: '列表',
                    click: () => mainWindow?.webContents.send('format-list')
                },
                {
                    label: '链接',
                    click: () => mainWindow?.webContents.send('format-link')
                },
                {
                    label: '图片',
                    click: () => mainWindow?.webContents.send('format-image')
                },
                {
                    label: '表格',
                    click: () => mainWindow?.webContents.send('format-table')
                },
                {
                    label: '水平线',
                    click: () => mainWindow?.webContents.send('format-hr')
                }
            ]
        },
        {
            label: '帮助',
            submenu: [
                {
                    label: '关于',
                    click: () => showAboutDialog()
                },
                {
                    label: 'Markdown 语法帮助',
                    click: () => showMarkdownHelp()
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// File operations
async function newFile(): Promise<void> {
    if (isUnsaved) {
        const result = await showUnsavedDialog();
        if (result === 'cancel') return;
        if (result === 'save') await saveFile();
    }

    currentFilePath = null;
    isUnsaved = false;
    updateWindowTitle();
    mainWindow?.webContents.send('file-new');
}

async function openFile(): Promise<void> {
    if (isUnsaved) {
        const result = await showUnsavedDialog();
        if (result === 'cancel') return;
        if (result === 'save') await saveFile();
    }

    const result = await dialog.showOpenDialog(mainWindow!, {
        filters: [{ name: 'Markdown Files', extensions: ['md', 'markdown', 'txt'] }],
        properties: ['openFile']
    });

    if (result.filePaths && result.filePaths.length > 0) {
        const content = await fs.readFile(result.filePaths[0], 'utf-8');
        currentFilePath = result.filePaths[0];
        isUnsaved = false;
        updateWindowTitle();
        mainWindow?.webContents.send('file-open', { content, filePath: currentFilePath });
    }
}

async function saveFile(): Promise<void> {
    if (!currentFilePath) {
        return saveFileAs();
    }

    const content = await getEditorContent();
    await fs.writeFile(currentFilePath, content, 'utf-8');
    isUnsaved = false;
    updateWindowTitle();
    mainWindow?.webContents.send('file-saved');
}

async function saveFileAs(): Promise<void> {
    const result = await dialog.showSaveDialog(mainWindow!, {
        filters: [{ name: 'Markdown Files', extensions: ['md', 'markdown', 'txt'] }],
        defaultPath: currentFilePath || 'untitled.md'
    });

    if (result.filePath) {
        const content = await getEditorContent();
        await fs.writeFile(result.filePath, content, 'utf-8');
        currentFilePath = result.filePath;
        isUnsaved = false;
        updateWindowTitle();
        mainWindow?.webContents.send('file-saved', { filePath: result.filePath });
    }
}

async function showUnsavedDialog(): Promise<string> {
    const result = await dialog.showMessageBox(mainWindow!, {
        type: 'warning',
        buttons: ['保存', '不保存', '取消'],
        defaultId: 0,
        cancelId: 2,
        message: '文件已修改',
        detail: '您是否要保存对文件的更改？'
    });

    return ['save', 'dont-save', 'cancel'][result.response];
}

function showAboutDialog(): void {
    dialog.showMessageBox(mainWindow!, {
        type: 'info',
        buttons: ['确定'],
        title: '关于 花洲 Markdown 编辑器',
        message: '花洲 Markdown 编辑器',
        detail: '版本 1.0.0\n\n一个现代化的 Markdown 桌面编辑器\n\n© 2025 花洲科技'
    });
}

function showMarkdownHelp(): void {
    dialog.showMessageBox(mainWindow!, {
        type: 'info',
        buttons: ['确定'],
        title: 'Markdown 语法帮助',
        message: 'Markdown 基本语法',
        detail: `# 标题
## 二级标题
### 三级标题

**粗体** 或 __粗体__
*斜体* 或 _斜体_
~~删除线~~

\`代码\`
\`\`\`代码块\`\`\`

> 引用

- 无序列表
1. 有序列表

[链接](url)
![图片](url)

| 表头 | 表头 |
|-------|-------|
| 内容 | 内容 |

--- 水平线`
    });
}

function getEditorContent(): Promise<string> {
    return new Promise((resolve) => {
        const handler = (_: IpcMainEvent, content: string) => {
            ipcMain.removeListener('editor-content-response', handler);
            resolve(content);
        };
        ipcMain.on('editor-content-response', handler);
        mainWindow?.webContents.send('get-editor-content');
    });
}

function updateWindowTitle(): void {
    const title = isUnsaved ? '● ' : '';
    const fileName = currentFilePath ? path.basename(currentFilePath) : '未命名';
    mainWindow?.setTitle(`${title}${fileName} - 花洲 Markdown 编辑器`);
}

// IPC handlers
ipcMain.on('editor-changed', () => {
    if (!isUnsaved) {
        isUnsaved = true;
        updateWindowTitle();
    }
});

ipcMain.on('get-editor-content', () => {
    // This will be handled in renderer and send back via 'editor-content-response'
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
