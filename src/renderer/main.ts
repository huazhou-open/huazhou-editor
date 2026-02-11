import { createApp } from 'vue';
import App from './App.vue';

// Import CodeMirror and dependencies
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/css/css';
import 'codemirror/mode/python/python';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/php/php';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/search/matchesonscrollbar';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/matchesonscrollbar.css';
import 'codemirror/addon/scroll/simplescrollbars.css';

// Import Marked for markdown parsing
import { marked } from 'marked';

// Expose CodeMirror and marked globally for composables
(window as any).CodeMirror = CodeMirror;
(window as any).marked = marked;

declare global {
  interface Window {
    electronAPI: {
      onFileNew: (callback: () => void) => void;
      onFolderOpened: (callback: (e: any, data: any) => void) => void;
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
