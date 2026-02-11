import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    // Folder operations
    onFolderOpened: (callback: (_e: any, data: any) => void) => ipcRenderer.on('folder-opened', callback),
    onFileOpen: (callback: (_e: any, data: any) => void) => ipcRenderer.on('file-open', callback),

    // Editor content
    sendEditorChanged: () => ipcRenderer.send('editor-changed'),

    // Tree file operations
    readFileFromTree: (filePath: string) => ipcRenderer.send('read-file-from-tree', filePath),
    saveCurrentFile: (content: string) => ipcRenderer.send('save-current-file', content)
});
