import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    // File operations
    onFileNew: (callback: (_: IpcRendererEvent) => void) => ipcRenderer.on('file-new', callback),
    onFileOpen: (callback: (_: IpcRendererEvent, data: { content: string; filePath: string }) => void) =>
        ipcRenderer.on('file-open', callback),
    onFileSaved: (callback: (_: IpcRendererEvent, data?: { filePath: string }) => void) =>
        ipcRenderer.on('file-saved', callback),

    // Editor notifications
    onEditorFind: (callback: (_: IpcRendererEvent) => void) => ipcRenderer.on('editor-find', callback),
    onEditorReplace: (callback: (_: IpcRendererEvent) => void) => ipcRenderer.on('editor-replace', callback),
    onEditorZoom: (callback: (_: IpcRendererEvent, data: { level: number }) => void) =>
        ipcRenderer.on('editor-zoom', callback),

    // Format commands
    onFormatBold: (callback: (_: IpcRendererEvent) => void) => ipcRenderer.on('format-bold', callback),
    onFormatItalic: (callback: (_: IpcRendererEvent) => void) => ipcRenderer.on('format-italic', callback),
    onFormatStrikethrough: (callback: (_: IpcRendererEvent) => void) =>
        ipcRenderer.on('format-strikethrough', callback),
    onFormatHeading: (callback: (_: IpcRendererEvent, data: { level: number }) => void) =>
        ipcRenderer.on('format-heading', callback),
    onFormatCode: (callback: (_: IpcRendererEvent) => void) => ipcRenderer.on('format-code', callback),
    onFormatQuote: (callback: (_: IpcRendererEvent) => void) => ipcRenderer.on('format-quote', callback),
    onFormatList: (callback: (_: IpcRendererEvent) => void) => ipcRenderer.on('format-list', callback),
    onFormatLink: (callback: (_: IpcRendererEvent) => void) => ipcRenderer.on('format-link', callback),
    onFormatImage: (callback: (_: IpcRendererEvent) => void) => ipcRenderer.on('format-image', callback),
    onFormatTable: (callback: (_: IpcRendererEvent) => void) => ipcRenderer.on('format-table', callback),
    onFormatHr: (callback: (_: IpcRendererEvent) => void) => ipcRenderer.on('format-hr', callback),

    // Editor content
    onGetEditorContent: (callback: (_: IpcRendererEvent) => void) =>
        ipcRenderer.on('get-editor-content', callback),
    sendEditorContent: (content: string) => ipcRenderer.send('editor-content-response', content),
    sendEditorChanged: () => ipcRenderer.send('editor-changed')
});

declare global {
    interface Window {
        electronAPI: {
            onFileNew: (callback: (_: IpcRendererEvent) => void) => void;
            onFileOpen: (callback: (_: IpcRendererEvent, data: { content: string; filePath: string }) => void) => void;
            onFileSaved: (callback: (_: IpcRendererEvent, data?: { filePath: string }) => void) => void;
            onEditorFind: (callback: (_: IpcRendererEvent) => void) => void;
            onEditorReplace: (callback: (_: IpcRendererEvent) => void) => void;
            onEditorZoom: (callback: (_: IpcRendererEvent, data: { level: number }) => void) => void;
            onFormatBold: (callback: (_: IpcRendererEvent) => void) => void;
            onFormatItalic: (callback: (_: IpcRendererEvent) => void) => void;
            onFormatStrikethrough: (callback: (_: IpcRendererEvent) => void) => void;
            onFormatHeading: (callback: (_: IpcRendererEvent, data: { level: number }) => void) => void;
            onFormatCode: (callback: (_: IpcRendererEvent) => void) => void;
            onFormatQuote: (callback: (_: IpcRendererEvent) => void) => void;
            onFormatList: (callback: (_: IpcRendererEvent) => void) => void;
            onFormatLink: (callback: (_: IpcRendererEvent) => void) => void;
            onFormatImage: (callback: (_: IpcRendererEvent) => void) => void;
            onFormatTable: (callback: (_: IpcRendererEvent) => void) => void;
            onFormatHr: (callback: (_: IpcRendererEvent) => void) => void;
            onGetEditorContent: (callback: (_: IpcRendererEvent) => void) => void;
            sendEditorContent: (content: string) => void;
            sendEditorChanged: () => void;
        };
    }
}
