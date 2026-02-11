<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import Toolbar from './components/Toolbar.vue';
import EditorPanel from './components/EditorPanel.vue';
import PreviewPanel from './components/PreviewPanel.vue';
import FileTreeSidebar from './components/FileTreeSidebar.vue';
import TableOfContents from './components/TableOfContents.vue';
import StatusBar from './components/StatusBar.vue';
import { useTheme } from './composables/useTheme';
import { useMarkdown } from './composables/useMarkdown';

// App state
const currentViewMode = ref<'split' | 'inline'>('split');
const isUnsaved = ref(false);
const currentFilePath = ref<string | null>(null);
const editorContent = ref('');
const fileTreeVisible = ref(false);
const tocVisible = ref(false);
const syncScroll = ref(true);

// Theme
const { currentTheme, toggleTheme, initTheme } = useTheme();

// Markdown
const markdownUtils = useMarkdown(() => editorContent.value);

// Initialize
onMounted(() => {
  initTheme();
  setupIPCHandlers();
});

// Format toolbar action
const handleToolbarAction = (action: string, payload?: any) => {
  emitActionToChildren(action, payload);
};

// Method to emit actions to child components
const emitActionToChildren = (action: string, payload?: any) => {
  // This will be handled by the editor panel
  window.dispatchEvent(new CustomEvent('editor-action', { detail: { action, payload } }));
};

// IPC handlers
const setupIPCHandlers = () => {
  // File operations
  if (window.electronAPI) {
    window.electronAPI.onFileNew((_) => {
      editorContent.value = '';
      isUnsaved.value = false;
    });

    window.electronAPI.onFileOpenFolder((_, { tree }) => {
      window.dispatchEvent(new CustomEvent('file-tree-data', { detail: { tree } }));
      fileTreeVisible.value = true;
    });

    window.electronAPI.onFileOpen((_, { content, filePath }) => {
      currentFilePath.value = filePath;
      editorContent.value = content;
      isUnsaved.value = false;
      window.dispatchEvent(new CustomEvent('editor-content-update', { detail: { content } }));
    });

    window.electronAPI.onFileSaved((_, data) => {
      isUnsaved.value = false;
      if (data && data.filePath) {
        currentFilePath.value = data.filePath;
      }
    });

    window.electronAPI.onEditorFind((_) => {
      window.dispatchEvent(new CustomEvent('editor-action', { detail: { action: 'find' } }));
    });

    window.electronAPI.onEditorReplace((_) => {
      window.dispatchEvent(new CustomEvent('editor-action', { detail: { action: 'replace' } }));
    });

    window.electronAPI.onEditorZoom((_, { level }) => {
      window.dispatchEvent(new CustomEvent('editor-action', { detail: { action: 'zoom', payload: { level } } }));
    });

    // Format actions
    window.electronAPI.onFormatBold((_) => {
      window.dispatchEvent(new CustomEvent('editor-action', { detail: { action: 'bold' } }));
    });
    window.electronAPI.onFormatItalic((_) => {
      window.dispatchEvent(new CustomEvent('editor-action', { detail: { action: 'italic' } }));
    });
    window.electronAPI.onFormatStrikethrough((_) => {
      window.dispatchEvent(new CustomEvent('editor-action', { detail: { action: 'strikethrough' } }));
    });
    window.electronAPI.onFormatHeading((_, { level }) => {
      window.dispatchEvent(new CustomEvent('editor-action', { detail: { action: 'heading', payload: { level } } }));
    });
    window.electronAPI.onFormatCode((_) => {
      window.dispatchEvent(new CustomEvent('editor-action', { detail: { action: 'code' } }));
    });
    window.electronAPI.onFormatQuote((_) => {
      window.dispatchEvent(new CustomEvent('editor-action', { detail: { action: 'quote' } }));
    });
    window.electronAPI.onFormatList((_) => {
      window.dispatchEvent(new CustomEvent('editor-action', { detail: { action: 'list' } }));
    });
    window.electronAPI.onFormatLink((_) => {
      window.dispatchEvent(new CustomEvent('editor-action', { detail: { action: 'link' } }));
    });
    window.electronAPI.onFormatImage((_) => {
      window.dispatchEvent(new CustomEvent('editor-action', { detail: { action: 'image' } }));
    });
    window.electronAPI.onFormatTable((_) => {
      window.dispatchEvent(new CustomEvent('editor-action', { detail: { action: 'table' } }));
    });
    window.electronAPI.onFormatHr((_) => {
      window.dispatchEvent(new CustomEvent('editor-action', { detail: { action: 'hr' } }));
    });

    window.electronAPI.onGetEditorContent((_) => {
      window.electronAPI.sendEditorContent(editorContent.value);
    });
  }
};

// Handle content change from editor
const handleContentChange = (content: string) => {
  editorContent.value = content;
  if (!isUnsaved.value) {
    isUnsaved.value = true;
    if (window.electronAPI) {
      window.electronAPI.sendEditorChanged();
    }
  }
};

// View mode switching
const switchViewMode = (mode: 'split' | 'inline') => {
  currentViewMode.value = mode;
  window.dispatchEvent(new CustomEvent('view-mode-change', { detail: { mode } }));
};

// Toggle sync scroll
const toggleSyncScroll = () => {
  syncScroll.value = !syncScroll.value;
};

// Toggle file tree
const closeFileTree = () => {
  fileTreeVisible.value = false;
};

// Toggle TOC
const closeTOC = () => {
  tocVisible.value = false;
};
</script>

<template>
  <div class="app-container">
    <!-- Toolbar -->
    <Toolbar
      :current-theme="currentTheme"
      :sync-scroll="syncScroll"
      :view-mode="currentViewMode"
      @theme-toggle="toggleTheme"
      @sync-toggle="toggleSyncScroll"
      @view-mode-change="switchViewMode"
      @action="handleToolbarAction"
    />

    <!-- Main Content -->
    <div class="main-content">
      <!-- File Tree Sidebar -->
      <FileTreeSidebar
        v-if="fileTreeVisible"
        @close="closeFileTree"
      />

      <!-- Content Area -->
      <div class="content-area">
        <EditorPanel
          :view-mode="currentViewMode"
          @content-change="handleContentChange"
        />

        <PreviewPanel
          :view-mode="currentViewMode"
          :content="editorContent"
        />
      </div>
    </div>

    <!-- TOC Sidebar -->
    <TableOfContents
      :visible="tocVisible"
      :content="editorContent"
      @close="closeTOC"
    />

    <!-- Status Bar -->
    <StatusBar :content="editorContent" />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-primary);
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
