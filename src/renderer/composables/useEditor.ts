import { ref, onMounted, onUnmounted } from 'vue';

// Extended CodeMirror type
interface CodeMirrorInstance {
  setValue: (value: string) => void;
  getValue: () => string;
  getCursor: () => { line: number; ch: number };
  setCursor: (line: number, ch: number) => void;
  getSelection: () => string;
  replaceSelection: (text: string) => void;
  replaceRange: (text: string, from: { line: number; ch: number }, to?: { line: number; ch: number }) => void;
  execCommand: (command: string) => void;
  somethingSelected: () => boolean;
  getLine: (line: number) => string;
  lineCount: () => number;
  focus: () => void;
  getScrollInfo: () => { top: number; height: number; clientHeight: number };
  refresh: () => void;
  on: (event: string, callback: (cm: CodeMirrorInstance, ...args: any[]) => void) => void;
  off: (event: string, callback: (cm: CodeMirrorInstance, ...args: any[]) => void) => void;
  getWrapperElement: () => HTMLElement;
}

declare global {
  interface Window {
    CodeMirror: {
      fromTextArea: (el: HTMLTextAreaElement, options: any) => CodeMirrorInstance;
    };
  }
}

export function useEditor(elementId: string, options: any = {}) {
  const editor = ref<CodeMirrorInstance | null>(null);

  const defaultOptions = {
    mode: 'markdown',
    lineNumbers: true,
    lineWrapping: true,
    theme: null,
    autofocus: true,
    tabSize: 4,
    ...options
  };

  const initEditor = () => {
    const textarea = document.getElementById(elementId) as HTMLTextAreaElement;
    if (textarea && window.CodeMirror) {
      editor.value = window.CodeMirror.fromTextArea(textarea, defaultOptions);
    }
  };

  onMounted(() => {
    // Wait for CodeMirror to be loaded
    if (window.CodeMirror) {
      initEditor();
    } else {
      const checkInterval = setInterval(() => {
        if (window.CodeMirror) {
          clearInterval(checkInterval);
          initEditor();
        }
      }, 100);
    }
  });

  const setValue = (value: string) => {
    editor.value?.setValue(value);
  };

  const getValue = () => {
    return editor.value?.getValue() || '';
  };

  const getCursor = () => {
    return editor.value?.getCursor() || { line: 0, ch: 0 };
  };

  const setCursor = (line: number, ch: number) => {
    editor.value?.setCursor(line, ch);
  };

  const getSelection = () => {
    return editor.value?.getSelection() || '';
  };

  const replaceSelection = (text: string) => {
    editor.value?.replaceSelection(text);
  };

  const replaceRange = (text: string, from: { line: number; ch: number }, to?: { line: number; ch: number }) => {
    editor.value?.replaceRange(text, from, to);
  };

  const execCommand = (command: string) => {
    editor.value?.execCommand(command);
  };

  const somethingSelected = () => {
    return editor.value?.somethingSelected() || false;
  };

  const getLine = (line: number) => {
    return editor.value?.getLine(line) || '';
  };

  const lineCount = () => {
    return editor.value?.lineCount() || 0;
  };

  const focus = () => {
    editor.value?.focus();
  };

  const getScrollInfo = () => {
    return editor.value?.getScrollInfo() || { top: 0, height: 0, clientHeight: 0 };
  };

  const refresh = () => {
    editor.value?.refresh();
  };

  const onChange = (callback: (cm: CodeMirrorInstance) => void) => {
    editor.value?.on('change', callback);
  };

  const onScroll = (callback: () => void) => {
    editor.value?.on('scroll', callback);
  };

  const setOption = (key: string, value: any) => {
    if (editor.value && (editor.value as any).setOption) {
      (editor.value as any).setOption(key, value);
    }
  };

  return {
    editor,
    initEditor,
    setValue,
    getValue,
    getCursor,
    setCursor,
    getSelection,
    replaceSelection,
    replaceRange,
    execCommand,
    somethingSelected,
    getLine,
    lineCount,
    focus,
    getScrollInfo,
    refresh,
    onChange,
    onScroll,
    setOption
  };
}
