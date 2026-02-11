import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    // File operations
    onFileNew: (callback: () => void) => ipcRenderer.on('file-new', callback),
    onFileOpen: (callback: (_e: any, data: any) => void) => ipcRenderer.on('file-open', callback),
    onFileSaved: (callback: (_e: any, data?: any) => void) => ipcRenderer.on('file-saved', callback),
    onFolderOpened: (callback: (_e: any, data: any) => void) => ipcRenderer.on('folder-opened', callback),

    // Editor notifications
    onEditorFind: (callback: () => void) => ipcRenderer.on('editor-find', callback),
    onEditorReplace: (callback: () => void) => ipcRenderer.on('editor-replace', callback),
    onEditorZoom: (callback: (_e: any, data: any) => void) => ipcRenderer.on('editor-zoom', callback),

    // Format commands
    onFormatBold: (callback: () => void) => ipcRenderer.on('format-bold', callback),
    onFormatItalic: (callback: () => void) => ipcRenderer.on('format-italic', callback),
    onFormatStrikethrough: (callback: () => void) => ipcRenderer.on('format-strikethrough', callback),
    onFormatHeading: (callback: (_e: any, data: any) => void) => ipcRenderer.on('format-heading', callback),
    onFormatCode: (callback: () => void) => ipcRenderer.on('format-code', callback),
    onFormatQuote: (callback: () => void) => ipcRenderer.on('format-quote', callback),
    onFormatList: (callback: () => void) => ipcRenderer.on('format-list', callback),
    onFormatLink: (callback: () => void) => ipcRenderer.on('format-link', callback),
    onFormatImage: (callback: () => void) => ipcRenderer.on('format-image', callback),
    onFormatTable: (callback: () => void) => ipcRenderer.on('format-table', callback),
    onFormatHr: (callback: () => void) => ipcRenderer.on('format-hr', callback),

    // Editor content
    onGetEditorContent: (callback: () => void) => ipcRenderer.on('get-editor-content', callback),
    sendEditorContent: (content: string) => ipcRenderer.send('editor-content-response', content),
    sendEditorChanged: () => ipcRenderer.send('editor-changed'),

    // Tree file operations
    readFileFromTree: (filePath: string) => ipcRenderer.send('read-file-from-tree', filePath),
    saveCurrentFile: (content: string) => ipcRenderer.send('save-current-file', content)
});
