import { ref, computed } from 'vue';

export interface FileTreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileTreeNode[];
}

export function useFileTree() {
  const tree = ref<FileTreeNode[]>([]);
  const selectedNode = ref<FileTreeNode | null>(null);
  const isExpanded = ref<Set<string>>(new Set());

  const setTree = (newTree: FileTreeNode[]) => {
    tree.value = newTree;
  };

  const selectNode = (node: FileTreeNode | null) => {
    selectedNode.value = node;
  };

  const toggleExpand = (node: FileTreeNode) => {
    if (node.isDirectory) {
      const key = node.path;
      const newExpanded = new Set(isExpanded.value);
      if (newExpanded.has(key)) {
        newExpanded.delete(key);
      } else {
        newExpanded.add(key);
      }
      isExpanded.value = newExpanded;
    }
  };

  const isNodeExpanded = (node: FileTreeNode) => {
    return isExpanded.value.has(node.path);
  };

  const getIconForNode = (node: FileTreeNode) => {
    const isMarkdown = node.name.endsWith('.md') ||
                       node.name.endsWith('.markdown') ||
                       node.name.endsWith('.txt');

    if (node.isDirectory) {
      return 'folder';
    }
    return isMarkdown ? 'markdown' : 'file';
  };

  return {
    tree,
    selectedNode,
    isExpanded,
    setTree,
    selectNode,
    toggleExpand,
    isNodeExpanded,
    getIconForNode
  };
}
