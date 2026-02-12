// Global type declarations for electronAPI
export {};

interface ElectronAPI {
  // Folder operations
  onFolderOpened: (callback: (_e: any, data: any) => void) => void;
  onFileOpen: (callback: (_e: any, data: any) => void) => void;

  // Editor content
  sendEditorChanged: () => void;

  // Tree file operations
  readFileFromTree: (filePath: string) => void;
  saveCurrentFile: (content: string) => void;

  // Config operations
  readConfig: () => Promise<any>;
  writeConfig: (config: any) => Promise<any>;
  getConfigPath: () => Promise<string>;
  onOpenConfig: (callback: () => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
