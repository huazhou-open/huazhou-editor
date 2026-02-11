<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  currentTheme: 'light' | 'dark';
  syncScroll: boolean;
  viewMode: 'split' | 'inline';
}>();

const emit = defineEmits<{
  'theme-toggle': [];
  'sync-toggle': [];
  'view-mode-change': [mode: 'split' | 'inline'];
  'action': [action: string, payload?: any];
}>();

const actions = [
  { id: 'new', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2 14 8 20 8', title: '新建 (Ctrl+N)' },
  { id: 'open', icon: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z', title: '打开文件 (Ctrl+O)' },
  { id: 'open-folder', icon: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z M3 7v6h6 M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13', title: '打开文件夹' },
  { id: 'save', icon: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21 17 13 7 13 7 21 M7 3 7 8 15 8', title: '保存 (Ctrl+S)' },
];

const editActions = [
  { id: 'undo', icon: 'M3 7v6h6 M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13', title: '撤销 (Ctrl+Z)' },
  { id: 'redo', icon: 'M21 7v6h-6 M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13', title: '重做 (Ctrl+Y)' },
];

const formatActions = [
  { id: 'bold', icon: 'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z', title: '粗体 (Ctrl+B)' },
  { id: 'italic', icon: 'M19 4 10 4 M14 20 5 20 M15 4 9 20', title: '斜体 (Ctrl+I)' },
  { id: 'strikethrough', icon: 'M3 12h18 M5 15a3 3 0 0 1 3-3 M16 12a3 3 0 0 1 3 3', title: '删除线 (Ctrl+D)' },
];

const headingActions = [
  { id: 'h1', label: 'H1', title: '标题 1' },
  { id: 'h2', label: 'H2', title: '标题 2' },
  { id: 'h3', label: 'H3', title: '标题 3' },
];

const insertActions = [
  { id: 'code', icon: 'M16 18 22 12 16 6 M8 6 2 12 8 18', title: '代码块' },
  { id: 'quote', icon: 'M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2.014-2A1.636 1.636 0 0 0 7 5a9 9 0 0 0 0 11 M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2.014-2A1.636 1.636 0 0 0 19 5a9 9 0 0 0 0 11', title: '引用' },
  { id: 'list', icon: 'M8 6 21 6 M8 12 21 12 M8 18 21 18 M3 6 3.01 6 M3 12 3.01 12 M3 18 3.01 18', title: '列表' },
  { id: 'link', icon: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71', title: '链接' },
  { id: 'image', icon: 'M3 3 18 18 2 2 r2 r2 M8.5 8.5 r1.5 1.5 M21 15 16 10 5 21', title: '图片' },
  { id: 'table', icon: 'M9 3H5a2 2 0 0 0-2 2v4 M9 3v18 M15 9v12 M15 21h4a2 2 0 0 0 2-2v-4', title: '表格' },
  { id: 'hr', icon: 'M4 12 20 12', title: '水平线' },
];

const toolActions = [
  { id: 'find', icon: 'M11 11 r8 8 M21 21 16.65 16.65', title: '查找 (Ctrl+F)' },
  { id: 'theme', icon: 'M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79z', title: '切换主题', active: () => props.currentTheme === 'dark' },
  { id: 'sync', icon: 'M21 12c0 1.66-4 3-9 3s-9-1.34-9-3 M3 12c0 1.66 4 3 9 3s9-1.34 9-3 M3 12c0-1.66 4-3 9-3s9 1.34 9 3', title: '同步滚动', active: () => props.syncScroll },
];

const handleAction = (action: string) => {
  if (action === 'theme') {
    emit('theme-toggle');
  } else if (action === 'sync') {
    emit('sync-toggle');
  } else {
    emit('action', action);
  }
};

const handleViewModeChange = (mode: 'split' | 'inline') => {
  emit('view-mode-change', mode);
};

const isActive = (action: any) => {
  return action.active ? action.active() : false;
};
</script>

<template>
  <div class="toolbar">
    <!-- File Actions -->
    <div class="toolbar-group">
      <button
        v-for="action in actions"
        :key="action.id"
        class="toolbar-btn"
        :data-action="action.id"
        :title="action.title"
        @click="handleAction(action.id)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path :d="action.icon" />
        </svg>
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <!-- Edit Actions -->
    <div class="toolbar-group">
      <button
        v-for="action in editActions"
        :key="action.id"
        class="toolbar-btn"
        :data-action="action.id"
        :title="action.title"
        @click="handleAction(action.id)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path :d="action.icon" />
        </svg>
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <!-- Format Actions -->
    <div class="toolbar-group">
      <button
        v-for="action in formatActions"
        :key="action.id"
        class="toolbar-btn"
        :data-action="action.id"
        :title="action.title"
        @click="handleAction(action.id)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path :d="action.icon" />
        </svg>
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <!-- Heading Actions -->
    <div class="toolbar-group">
      <button
        v-for="action in headingActions"
        :key="action.id"
        class="toolbar-btn"
        :data-action="action.id"
        :title="action.title"
        @click="handleAction(action.id)"
      >
        {{ action.label }}
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <!-- Insert Actions -->
    <div class="toolbar-group">
      <button
        v-for="action in insertActions"
        :key="action.id"
        class="toolbar-btn"
        :data-action="action.id"
        :title="action.title"
        @click="handleAction(action.id)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path :d="action.icon" />
        </svg>
      </button>
    </div>

    <div class="toolbar-separator"></div>

    <!-- Tool Actions -->
    <div class="toolbar-group">
      <button
        v-for="action in toolActions"
        :key="action.id"
        class="toolbar-btn"
        :class="{ active: isActive(action) }"
        :data-action="action.id"
        :title="action.title"
        @click="handleAction(action.id)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path :d="action.icon" />
        </svg>
      </button>
    </div>

    <div class="toolbar-spacer"></div>

    <!-- View Mode Toggle -->
    <div class="toolbar-group">
      <button
        class="mode-btn"
        :class="{ active: viewMode === 'split' }"
        title="分屏模式"
        @click="handleViewModeChange('split')"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="12" y1="3" x2="12" y2="21"></line>
        </svg>
      </button>
      <button
        class="mode-btn"
        :class="{ active: viewMode === 'inline' }"
        title="即时预览模式"
        @click="handleViewModeChange('inline')"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <path d="M9 12h6"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--toolbar-bg);
  border-bottom: 1px solid var(--border-color);
  gap: 4px;
  min-height: 48px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toolbar-btn,
.mode-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  font-weight: 600;
}

.toolbar-btn:hover,
.mode-btn:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.toolbar-btn.active,
.mode-btn.active {
  background-color: var(--accent-color);
  color: white;
}

.toolbar-separator {
  width: 1px;
  height: 20px;
  background-color: var(--border-color);
  margin: 0 4px;
}

.toolbar-spacer {
  flex: 1;
}
</style>
