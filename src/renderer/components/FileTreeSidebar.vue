<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, onUnmounted } from 'vue';
import { useFileTree, FileTreeNode } from '../composables/useFileTree';

const props = defineProps<{
}>();

const emit = defineEmits<{
  'close': [];
  'file-select': [node: FileTreeNode];
}>();

const { tree, selectedNode, toggleExpand, isNodeExpanded, getIconForNode, setTree, selectNode } = useFileTree();

// Icons
const folderIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
const fileIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;
const markdownIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><text x="8" y="18" font-size="8" fill="currentColor" font-weight="bold">M</text></svg>`;
const arrowIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;

const getIcon = (node: FileTreeNode) => {
  if (node.isDirectory) return folderIcon;
  const isMarkdown = node.name.endsWith('.md') || node.name.endsWith('.markdown') || node.name.endsWith('.txt');
  return isMarkdown ? markdownIcon : fileIcon;
};

const handleNodeClick = (node: FileTreeNode) => {
  if (node.isDirectory) {
    toggleExpand(node);
  } else {
    selectNode(node);
    emit('file-select', node);
    if (window.electronAPI) {
      window.electronAPI.readFileFromTree(node.path);
    }
  }
};

onMounted(() => {
  window.addEventListener('file-tree-data', (e) => {
    const detail = (e as CustomEvent).detail;
    setTree(detail.tree);
  });
});
</script>

<template>
  <div class="file-tree-sidebar">
    <div class="sidebar-header">
      <span class="sidebar-title">文件</span>
      <button class="sidebar-close" @click="emit('close')">×</button>
    </div>
    <div class="file-tree-content">
      <FileTreeNodeComponent
        v-for="node in tree"
        :key="node.path"
        :node="node"
        :depth="0"
        @click="handleNodeClick"
        :is-expanded="isNodeExpanded(node)"
        :is-selected="selectedNode === node"
      />
    </div>
  </div>
</template>

<script lang="ts">
// Recursive component for tree nodes
import { defineComponent } from 'vue';

const FileTreeNodeComponent = defineComponent({
  name: 'FileTreeNodeComponent',
  props: {
    node: { type: Object as () => FileTreeNode, required: true },
    depth: { type: Number, default: 0 },
    isExpanded: { type: Boolean, default: false },
    isSelected: { type: Boolean, default: false }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const arrowIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
    const folderIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`;
    const fileIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;
    const markdownIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><text x="8" y="18" font-size="8" fill="currentColor" font-weight="bold">M</text></svg>`;

    const getIcon = () => {
      if (props.node.isDirectory) return folderIcon;
      const isMarkdown = props.node.name.endsWith('.md') || props.node.name.endsWith('.markdown') || props.node.name.endsWith('.txt');
      return isMarkdown ? markdownIcon : fileIcon;
    };

    const handleClick = () => {
      emit('click', props.node);
    };

    return { arrowIcon, getIcon, handleClick };
  },
  template: `
    <div>
      <div
        class="tree-item"
        :class="{
          'tree-item-folder': node.isDirectory,
          'tree-item-file': !node.isDirectory,
          'expanded': isExpanded,
          'active': isSelected
        }"
        :style="{ paddingLeft: (depth * 12 + 8) + 'px' }"
        @click="handleClick"
      >
        <span
          class="tree-item-arrow"
          :style="{ visibility: node.isDirectory && node.children && node.children.length > 0 ? 'visible' : 'hidden', transform: isExpanded ? 'rotate(90deg)' : 'none' }"
          v-html="arrowIcon"
        ></span>
        <span class="tree-item-icon" v-html="getIcon()"></span>
        <span class="tree-item-name">{{ node.name }}</span>
      </div>
      <div v-if="node.isDirectory && node.children && node.children.length > 0 && isExpanded" class="tree-item-children">
        <FileTreeNodeComponent
          v-for="child in node.children"
          :key="child.path"
          :node="child"
          :depth="depth + 1"
          :is-expanded="false"
          :is-selected="false"
          @click="$emit('click', $event)"
        />
      </div>
    </div>
  `
});
</script>

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

.tree-item {
  display: flex;
  align-items: center;
  padding: 6px 0;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
  user-select: none;
}

.tree-item:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.tree-item.active {
  background-color: var(--accent-color);
  color: white;
}

.tree-item-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  flex-shrink: 0;
  color: inherit;
}

.tree-item-folder .tree-item-icon {
  color: #dcb67a;
}

.tree-item-file .tree-item-icon {
  color: var(--text-secondary);
}

.tree-item.markdown .tree-item-icon {
  color: #519aba;
}

.tree-item-name {
  flex: 1;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tree-item-arrow {
  width: 12px;
  height: 12px;
  margin-right: 4px;
  transition: transform 0.2s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.tree-item-children {
  display: block;
}
</style>
