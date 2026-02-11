<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, onUnmounted, watch } from 'vue';
import { useEditor } from '../composables/useEditor';
import { useFormat } from '../composables/useFormat';

const props = defineProps<{
  viewMode: 'split' | 'inline';
}>();

const emit = defineEmits<{
  'content-change': [content: string];
  'editor-ready': [];
}>();

// Split mode editor
const { editor: splitEditor, initEditor: initSplitEditor, onChange: onSplitChange, onScroll: onSplitScroll, setOption: setSplitOption } = useEditor('editor');
// Inline mode editor
const { editor: inlineEditor, initEditor: initInlineEditor, onChange: onInlineChange, onScroll: onInlineScroll, setOption: setInlineOption } = useEditor('inline-editor');

// Format utilities
const { wrapSelection, insertHeading, insertCodeBlock, insertQuote, insertList, insertLink, insertImage, insertTable, insertHorizontalRule } = useFormat();

const getActiveEditor = () => {
  return props.viewMode === 'split' ? splitEditor.value : inlineEditor.value;
};

// Handle editor content change
const handleChange = () => {
  const activeEditor = getActiveEditor();
  if (activeEditor) {
    const content = activeEditor.getValue();
    emit('content-change', content);

    // Sync content between editors
    if (props.viewMode === 'split' && inlineEditor.value) {
      inlineEditor.value.setValue(content);
    } else if (props.viewMode === 'inline' && splitEditor.value) {
      splitEditor.value.setValue(content);
    }
  }
};

// Handle toolbar actions
const handleAction = (event: Event) => {
  const detail = (event as CustomEvent).detail;
  const { action, payload } = detail;

  const activeEditor = getActiveEditor();
  if (!activeEditor) return;

  switch (action) {
    case 'new':
      activeEditor.setValue('');
      break;
    case 'undo':
      activeEditor.execCommand('undo');
      break;
    case 'redo':
      activeEditor.execCommand('redo');
      break;
    case 'bold':
      wrapSelection(activeEditor, '**', '**');
      break;
    case 'italic':
      wrapSelection(activeEditor, '*', '*');
      break;
    case 'strikethrough':
      wrapSelection(activeEditor, '~~', '~~');
      break;
    case 'h1':
    case 'h2':
    case 'h3':
      const level = parseInt(action.charAt(1));
      insertHeading(activeEditor, level);
      break;
    case 'heading':
      insertHeading(activeEditor, payload?.level || 1);
      break;
    case 'code':
      insertCodeBlock(activeEditor);
      break;
    case 'quote':
      insertQuote(activeEditor);
      break;
    case 'list':
      insertList(activeEditor);
      break;
    case 'link':
      insertLink(activeEditor);
      break;
    case 'image':
      insertImage(activeEditor);
      break;
    case 'table':
      insertTable(activeEditor);
      break;
    case 'hr':
      insertHorizontalRule(activeEditor);
      break;
    case 'find':
      activeEditor.execCommand('find');
      break;
    case 'replace':
      activeEditor.execCommand('replace');
      break;
    case 'zoom':
      handleZoom(payload?.level);
      break;
  }
};

const handleZoom = (level: number) => {
  const currentFontSize = parseFloat(getComputedStyle(document.body).fontSize);
  const newSize = level === 0 ? 14 : currentFontSize + level;

  if (splitEditor.value) {
    splitEditor.value.getWrapperElement().style.fontSize = `${newSize}px`;
    splitEditor.value.refresh();
  }
  if (inlineEditor.value) {
    inlineEditor.value.getWrapperElement().style.fontSize = `${newSize}px`;
    inlineEditor.value.refresh();
  }
};

// Initialize on mount
onMounted(() => {
  initSplitEditor();
  initInlineEditor();

  // Set up split editor handlers
  onSplitChange((cm) => {
    if (props.viewMode === 'split') {
      handleChange();
    }
  });

  // Set up inline editor handlers
  onInlineChange((cm) => {
    if (props.viewMode === 'inline') {
      handleChange();
    }
  });

  // Listen for action events
  window.addEventListener('editor-action', handleAction);

  // Listen for content update from parent
  window.addEventListener('editor-content-update', (e) => {
    const detail = (e as CustomEvent).detail;
    const activeEditor = getActiveEditor();
    if (activeEditor) {
      activeEditor.setValue(detail.content);
      if (splitEditor.value) splitEditor.value.setValue(detail.content);
      if (inlineEditor.value) inlineEditor.value.setValue(detail.content);
    }
  });

  // Listen for view mode changes
  window.addEventListener('view-mode-change', (e) => {
    const detail = (e as CustomEvent).detail;
    const activeEditor = getActiveEditor();
    if (activeEditor) {
      activeEditor.refresh();
    }
  });

  // Emit ready event
  emit('editor-ready');
});

onUnmounted(() => {
  window.removeEventListener('editor-action', handleAction);
});

// Apply CodeMirror theme when theme changes
watch(() => props.viewMode, (newMode) => {
  const activeEditor = getActiveEditor();
  if (activeEditor) {
    activeEditor.focus();
  }
});
</script>

<template>
  <div class="editor-panels">
    <!-- Split Mode -->
    <div v-if="viewMode === 'split'" class="split-mode">
      <div class="editor-panel">
        <div class="panel-header">
          <span class="panel-title">编辑器</span>
        </div>
        <div class="editor-container">
          <textarea id="editor"></textarea>
        </div>
      </div>
    </div>

    <!-- Inline Mode -->
    <div v-else class="inline-mode">
      <div class="inline-editor">
        <textarea id="inline-editor"></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-panels {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.split-mode {
  display: flex;
  width: 100%;
}

.editor-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-color);
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.editor-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.inline-editor {
  flex: 1;
  overflow: hidden;
  position: relative;
  border-bottom: 1px solid var(--border-color);
}
</style>
