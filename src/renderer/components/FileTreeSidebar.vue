<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';
import FileTreeItem, { FileTreeNode } from './FileTreeItem.vue';

const props = defineProps<{
  tree: FileTreeNode[];
}>();

const emit = defineEmits<{
  'close': [];
  'file-select': [node: FileTreeNode];
}>();

const selectedPath = ref<string | null>(null);
const expandedPaths = ref<Set<string>>(new Set());

const isExpanded = (node: FileTreeNode) => {
  return expandedPaths.value.has(node.path);
};

const isSelected = (node: FileTreeNode) => {
  return selectedPath.value === node.path;
};

const toggleExpand = (node: FileTreeNode) => {
  if (node.isDirectory) {
    const newSet = new Set(expandedPaths.value);
    if (newSet.has(node.path)) {
      newSet.delete(node.path);
    } else {
      newSet.add(node.path);
    }
    expandedPaths.value = newSet;
  }
};

const selectNode = (node: FileTreeNode) => {
  selectedPath.value = node.path;
  emit('file-select', node);
  if (window.electronAPI) {
    window.electronAPI.readFileFromTree(node.path);
  }
};

const handleNodeClick = (node: FileTreeNode) => {
  if (node.isDirectory) {
    toggleExpand(node);
  } else {
    selectNode(node);
  }
};

// 过滤只显示.md文件
const isMarkdownFile = (name: string): boolean => {
  return name.endsWith('.md') || name.endsWith('.markdown');
};

// 过滤文件树，只保留文件夹和.md文件
const filterTree = (nodes: FileTreeNode[]): FileTreeNode[] => {
  return nodes.map(node => {
    if (node.isDirectory) {
      // 对于文件夹，递归过滤子节点
      return {
        ...node,
        children: node.children ? filterTree(node.children) : []
      };
    } else {
      // 对于文件，只保留.md文件
      return node;
    }
  }).filter(node => {
    // 保留文件夹和.md文件
    if (node.isDirectory) {
      // 如果是文件夹，至少包含一个.md文件或子文件夹
      return node.children && node.children.length > 0;
    } else {
      return isMarkdownFile(node.name);
    }
  });
};

// 计算过滤后的文件树
const filteredTree = computed(() => filterTree(props.tree));

// 导出类型供外部使用
export type { FileTreeNode };
</script>

<template>
  <div class="file-tree-sidebar">
    <div class="sidebar-header">
      <span class="sidebar-title">Markdown 文件</span>
      <button class="sidebar-close" @click="emit('close')">×</button>
    </div>
    <div class="file-tree-content">
      <template v-if="filteredTree.length === 0">
        <div class="empty-message">没有找到 Markdown 文件</div>
      </template>
      <template v-else>
        <FileTreeItem
          v-for="node in filteredTree"
          :key="node.path"
          :node="node"
          :level="0"
          :is-selected="isSelected"
          :is-expanded="isExpanded"
          @node-click="handleNodeClick"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.file-tree-sidebar {
  width: var(--sidebar-width);
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--toolbar-bg);
}

.sidebar-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-close {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-secondary);
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.sidebar-close:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.file-tree-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.empty-message {
  padding: 20px;
  color: var(--text-secondary);
  text-align: center;
  font-size: 13px;
}
</style>
