import { app, BrowserWindow, Menu, dialog, ipcMain, Event } from 'electron';
import path from 'path';
import { promises as fs } from 'fs';

let mainWindow: BrowserWindow | null = null;
let currentFilePath: string | null = null;
let currentFolderPath: string | null = null;
let isUnsaved = false;

interface FileTreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileTreeNode[];
}

function createWindow() {
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

    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Initialize menu
    createMenu();
}

function createMenu() {
    const template = [
        {
            label: '文件',
            submenu: [
                {
                    label: '打开文件夹...',
                    click: () => openFolder()
                }
            ]
        }
    ] as any;

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

async function openFolder() {
    const { filePaths } = await dialog.showOpenDialog(mainWindow!, {
        properties: ['openDirectory']
    });

    if (filePaths && filePaths.length > 0) {
        currentFolderPath = filePaths[0];
        const tree = await buildFileTree(currentFolderPath);
        mainWindow?.webContents.send('folder-opened', { folderPath: currentFolderPath, tree });
    }
}

async function buildFileTree(dirPath: string): Promise<FileTreeNode[]> {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    const tree: FileTreeNode[] = [];

    for (const item of items) {
        if (item.name.startsWith('.')) continue; // Skip hidden files

        const fullPath = path.join(dirPath, item.name);
        const node: FileTreeNode = {
            name: item.name,
            path: fullPath,
            isDirectory: item.isDirectory()
        };

        if (item.isDirectory()) {
            node.children = await buildFileTree(fullPath);
        }

        tree.push(node);
    }

    // Sort: directories first, then files, both alphabetically
    tree.sort((a, b) => {
        if (a.isDirectory !== b.isDirectory) {
            return a.isDirectory ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    });

    return tree;
}

async function readFileContent(filePath: string) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        currentFilePath = filePath;
        isUnsaved = false;
        updateWindowTitle();
        mainWindow?.webContents.send('file-open', { content, filePath });
        return { content };
    } catch (error: any) {
        return { error: error.message };
    }
}

function updateWindowTitle() {
    if (!mainWindow) return;
    const title = isUnsaved ? '● ' : '';
    const fileName = currentFilePath ? path.basename(currentFilePath) : '未命名';
    mainWindow.setTitle(`${title}${fileName} - 花洲 Markdown 编辑器`);
}

// IPC handlers
ipcMain.on('editor-changed', () => {
    if (!isUnsaved) {
        isUnsaved = true;
        updateWindowTitle();
    }
});

ipcMain.on('read-file-from-tree', async (_: Event, filePath: string) => {
    const result = await readFileContent(filePath);
    if (result.error) {
        dialog.showErrorBox('读取文件错误', result.error);
    }
});

ipcMain.on('save-current-file', async (_: Event, content: string) => {
    if (currentFilePath) {
        await fs.writeFile(currentFilePath, content, 'utf-8');
        isUnsaved = false;
        updateWindowTitle();
    }
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
