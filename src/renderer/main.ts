import { createApp } from 'vue';
import App from './App.vue';

// Import Element Plus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';

// Import Element Plus Icons
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

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
      onFolderOpened: (callback: (e: any, data: any) => void) => void;
      onFileOpen: (callback: (e: any, data: any) => void) => void;
      sendEditorChanged: () => void;
      readFileFromTree: (path: string) => void;
      saveCurrentFile: (content: string) => void;
      readConfig: () => Promise<any>;
      writeConfig: (config: any) => Promise<any>;
      getConfigPath: () => Promise<string>;
      onOpenConfig: (callback: () => void) => void;
    };
  }
}

const app = createApp(App);

// Use Element Plus
app.use(ElementPlus);

// Register all icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');
