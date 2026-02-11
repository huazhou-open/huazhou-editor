<script lang="ts">
import { defineComponent } from 'vue';

export interface FileTreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileTreeNode[];
}

export default defineComponent({
  name: 'FileTreeItem',
  props: {
    node: {
      type: Object as () => FileTreeNode,
      required: true
    },
    level: {
      type: Number,
      default: 0
    },
    isSelected: {
      type: Function,
      required: true
    },
    isExpanded: {
      type: Function,
      required: true
    }
  },
  emits: ['node-click'],
  template: `
    <div>
      <div
        class="tree-item"
        :class="{ expanded: isExpanded(node), active: isSelected(node) }"
        :style="{ paddingLeft: (level * 16) + 'px' }"
        @click="$emit('node-click', node)"
      >
        <div class="tree-item-row">
          <span v-if="node.isDirectory" class="tree-arrow">
            {{ isExpanded(node) ? '▾' : '▸' }}
          </span>
          <span v-else class="tree-arrow-spacer"></span>
          <span class="tree-icon">{{ node.isDirectory ? '📁' : '📄' }}</span>
          <span class="tree-name">{{ node.name }}</span>
        </div>
      </div>
      <template v-if="node.isDirectory && node.children && isExpanded(node)">
        <FileTreeItem
          v-for="child in node.children"
          :key="child.path"
          :node="child"
          :level="level + 1"
          :is-selected="isSelected"
          :is-expanded="isExpanded"
          @node-click="$emit('node-click', $event)"
        />
      </template>
    </div>
  `
});
</script>

<style scoped>
.tree-item {
  cursor: pointer;
  user-select: none;
}

.tree-item:hover > .tree-item-row {
  background-color: var(--bg-tertiary);
}

.tree-item.active > .tree-item-row {
  background-color: var(--accent-color);
  color: white;
}

.tree-item.active > .tree-item-row .tree-name {
  color: white;
}

.tree-item-row {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  color: var(--text-secondary);
  transition: background-color 0.15s;
}

.tree-arrow {
  width: 16px;
  text-align: center;
  font-size: 10px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.tree-arrow-spacer {
  width: 16px;
  flex-shrink: 0;
}

.tree-icon {
  margin-right: 8px;
  font-size: 14px;
  flex-shrink: 0;
}

.tree-name {
  flex: 1;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
