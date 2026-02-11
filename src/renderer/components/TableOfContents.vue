<script setup lang="ts">
import { defineProps, defineEmits, watch, ref } from 'vue';
import { useTableOfContents, TOCItem } from '../composables/useTableOfContents';

const props = defineProps<{
  visible: boolean;
  content: string;
}>();

const emit = defineEmits<{
  'close': [];
}>();

const { items, updateTOC, jumpToHeading, getIndentClass } = useTableOfContents();

// Update TOC when content changes
watch(() => props.content, (newContent) => {
  updateTOC(newContent);
}, { immediate: true });

const handleItemClick = (item: TOCItem) => {
  // Get editor reference from window
  const editor = (window as any).activeEditor;
  if (editor) {
    jumpToHeading(item.line,
      (line: number, ch: number) => editor.setCursor(line, ch),
      () => editor.focus()
    );
  }
};
</script>

<template>
  <div class="toc-sidebar" :class="{ open: visible }">
    <div class="toc-header">
    </div>
    <div class="toc-content">
      <div
        v-for="item in items"
        :key="item.line"
        :class="['toc-item', getIndentClass(item.level)]"
        :title="item.text"
        @click="handleItemClick(item)"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.toc-sidebar {
  position: fixed;
  right: 0;
  top: 48px;
  width: 250px;
  height: calc(100vh - 48px);
  background-color: var(--bg-secondary);
  border-left: 1px solid var(--border-color);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 1000;
}

.toc-sidebar.open {
  transform: translateX(0);
}

.toc-header {
  display: flex;
;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.toc-header span {
  font-weight: 600;
  color: var(--text-primary);
}

.toc-close {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-secondary);
  cursor: pointer;
}

.toc-close:hover {
  color: var(--text-primary);
}

.toc-content {
  padding: 12px;
  overflow-y: auto;
}

.toc-item {
  padding: 6px 12px;
  cursor: pointer;
  color: var(--text-secondary);
  border-radius: 4px;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toc-item:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.toc-item.h1 {
  font-weight: 600;
  font-size: 14px;
}

.toc-item.h2 {
  padding-left: 24px;
  font-size: 13px;
}

.toc-item.h3 {
  padding-left: 36px;
  font-size: 12px;
}

.toc-item.h4 {
  padding-left: 48px;
  font-size: 11px;
}

.toc-item.h5 {
  padding-left: 60px;
  font-size: 11px;
}

.toc-item.h6 {
  padding-left: 72px;
  font-size: 11px;
}
</style>
