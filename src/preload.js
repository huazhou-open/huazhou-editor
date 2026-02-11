const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // File operations
    onFileNew: (callback) => ipcRenderer.on('file-new', callback),
    onFileOpen: (callback) => ipcRenderer.on('file-open', callback),
    onFileSaved: (callback) => ipcRenderer.on('file-saved', callback),

    // Editor notifications
    onEditorFind: (callback) => ipcRenderer.on('editor-find', callback),
    onEditorReplace: (callback) => ipcRenderer.on('editor-replace', callback),
    onEditorZoom: (callback) => ipcRenderer.on('editor-zoom', callback),

    // Format commands
    onFormatBold: (callback) => ipcRenderer.on('format-bold', callback),
    onFormatItalic: (callback) => ipcRenderer.on('format-italic', callback),
    onFormatStrikethrough: (callback) => ipcRenderer.on('format-strikethrough', callback),
    onFormatHeading: (callback) => ipcRenderer.on('format-heading', callback),
    onFormatCode: (callback) => ipcRenderer.on('format-code', callback),
    onFormatQuote: (callback) => ipcRenderer.on('format-quote', callback),
    onFormatList: (callback) => ipcRenderer.on('format-list', callback),
    onFormatLink: (callback) => ipcRenderer.on('format-link', callback),
    onFormatImage: (callback) => ipcRenderer.on('format-image', callback),
    onFormatTable: (callback) => ipcRenderer.on('format-table', callback),
    onFormatHr: (callback) => ipcRenderer.on('format-hr', callback),

    // Editor content
    onGetEditorContent: (callback) => ipcRenderer.on('get-editor-content', callback),
    sendEditorContent: (content) => ipcRenderer.send('editor-content-response', content),
    sendEditorChanged: () => ipcRenderer.send('editor-changed')
});
