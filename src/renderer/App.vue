<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Toolbar from './components/Toolbar.vue';
import EditorPanel from './components/EditorPanel.vue';
import PreviewPanel from './components/PreviewPanel.vue';
import FileTreeSidebar, { FileTreeNode } from './components/FileTreeSidebar.vue';
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
const fileTreeData = ref<FileTreeNode[]>([]);

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
  if (window.electronAPI) {
    window.electronAPI.onFolderOpened((_, { tree }) => {
      fileTreeData.value = tree;
      fileTreeVisible.value = true;
    });

    window.electronAPI.onFileOpen((_, { content, filePath }) => {
      currentFilePath.value = filePath;
      editorContent.value = content;
      isUnsaved.value = false;
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

// Handle file select from file tree
const handleFileSelect = (node: FileTreeNode) => {
  // File reading is handled by the main process via IPC
  if (window.electronAPI) {
    window.electronAPI.readFileFromTree(node.path);
  }
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
        :tree="fileTreeData"
        @close="closeFileTree"
        @file-select="handleFileSelect"
      />

      <!-- Content Area -->
      <div class="content-area">
        <EditorPanel
          :view-mode="currentViewMode"
          :content="editorContent"
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
  flex-direction: row;
  overflow: hidden;
}
</style>
