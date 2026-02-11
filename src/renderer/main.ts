import { createApp } from 'vue';
import App from './App.vue';

declare global {
  interface Window {
    electronAPI: {
      onFileNew: (callback: () => void) => void;
      onFileOpenFolder: (callback: (e: any, data: any) => void) => void;
      onFileOpen: (callback: (e: any, data: any) => void) => void;
      onFileSaved: (callback: (e: any, data?: any) => void) => void;
      onEditorFind: (callback: () => void) => void;
      onEditorReplace: (callback: () => void) => void;
      onEditorZoom: (callback: (e: any, data: any) => void) => void;
      onFormatBold: (callback: () => void) => void;
      onFormatItalic: (callback: () => void) => void;
      onFormatStrikethrough: (callback: () => void) => void;
      onFormatHeading: (callback: (e: any, data: any) => void) => void;
      onFormatCode: (callback: () => void) => void;
      onFormatQuote: (callback: () => void) => void;
      onFormatList: (callback: () => void) => void;
      onFormatLink: (callback: () => void) => void;
      onFormatImage: (callback: () => void) => void;
      onFormatTable: (callback: () => void) => void;
      onFormatHr: (callback: () => void) => void;
      onGetEditorContent: (callback: () => void) => void;
      sendEditorChanged: () => void;
      sendEditorContent: (content: string) => void;
      readFileFromTree: (path: string) => void;
    };
  }
}

const app = createApp(App);
app.mount('#app');
