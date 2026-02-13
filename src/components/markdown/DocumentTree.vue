<template>
  <div class="document-tree" @contextmenu="handleBlankContextMenu">
    <div v-if="folderPath" class="folder-info">
      <el-icon><FolderOpened /></el-icon>
      <span>{{ folderPath }}</span>
    </div>
    <el-tree
      v-if="fileTree.length > 0"
      :data="fileTree"
      :props="{ label: 'name', children: 'children' }"
      node-key="id"
      default-expand-all
      @node-click="handleNodeClick"
      @node-contextmenu="handleContextMenu"
    />
    <div v-else class="empty-state">
      <el-empty description="请打开一个包含 Markdown 文件的文件夹" />
    </div>

    <!-- 右键菜单 -->
    <el-menu
      v-if="contextMenuVisible"
      :default-active="contextMenuAction"
      class="context-menu"
      style="position: absolute; left: 0; top: 0; min-width: 150px;"
      @select="handleMenuSelect"
    >
      <el-menu-item index="newFile">
        <el-icon><DocumentAdd /></el-icon>
        新建文件
      </el-menu-item>
      <el-menu-item index="newFolder">
        <el-icon><FolderAdd /></el-icon>
        新建文件夹
      </el-menu-item>
      <template v-if="selectedNode">
        <el-menu-item index="rename">
          <el-icon><Edit /></el-icon>
          重命名
        </el-menu-item>
        <el-menu-item index="delete">
          <el-icon><Delete /></el-icon>
          删除
        </el-menu-item>
      </template>
    </el-menu>

    <!-- 重命名对话框 -->
    <el-dialog
      v-model="renameDialogVisible"
      title="重命名"
      width="400px"
      @closed="resetRename"
    >
      <el-input
        v-model="newFileName"
        placeholder="请输入新文件名"
        @keyup.enter="confirmRename"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetRename">取消</el-button>
          <el-button type="primary" @click="confirmRename">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新建文件对话框 -->
    <el-dialog
      v-model="newFileDialogVisible"
      title="新建文件"
      width="400px"
      @closed="resetNewFile"
    >
      <el-input
        v-model="newFileName"
        placeholder="请输入文件名"
        @keyup.enter="confirmNewFile"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetNewFile">取消</el-button>
          <el-button type="primary" @click="confirmNewFile">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新建文件夹对话框 -->
    <el-dialog
      v-model="newFolderDialogVisible"
      title="新建文件夹"
      width="400px"
      @closed="resetNewFolder"
    >
      <el-input
        v-model="newFolderName"
        placeholder="请输入文件夹名"
        @keyup.enter="confirmNewFolder"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetNewFolder">取消</el-button>
          <el-button type="primary" @click="confirmNewFolder">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="400px"
    >
      <p>确定要删除 {{ selectedNode?.label }} 吗？</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { FolderOpened, DocumentAdd, FolderAdd, Edit, Delete } from '@element-plus/icons-vue'
import type { FileNode } from '@/types/electron'
import { ElMessage, ElMessageBox } from 'element-plus'

const folderPath = ref<string>('')
const fileTree = ref<FileNode[]>([])
const selectedNode = ref<FileNode | null>(null)
const contextMenuVisible = ref(false)
const contextMenuAction = ref('')
const contextMenuPosition = ref({ x: 0, y: 0 })
const renameDialogVisible = ref(false)
const newFileDialogVisible = ref(false)
const newFolderDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const newFileName = ref('')
const newFolderName = ref('')

// 处理节点点击事件
const emit = defineEmits(['file-click'])
const handleNodeClick = (data: FileNode) => {
  console.log('[DocumentTree] Node clicked:', data)
  if (data.type === 'file') {
    console.log('[DocumentTree] Emitting file-click with path:', data.path)
    emit('file-click', data.path)
  }
}

// 处理空白区域右键菜单
const handleBlankContextMenu = (event: MouseEvent) => {
  // 只有点击的是空白区域才显示菜单
  const target = event.target as HTMLElement
  if (target.closest('.el-tree-node__content')) {
    return
  }

  event.preventDefault()
  event.stopPropagation()
  selectedNode.value = null  // 空白区域没有选中节点
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  contextMenuVisible.value = true

  // 点击其他地方关闭菜单
  const handleClickOutside = () => {
    contextMenuVisible.value = false
    document.removeEventListener('click', handleClickOutside)
  }

  nextTick(() => {
    document.addEventListener('click', handleClickOutside)
  })
}

// 处理右键菜单
const handleContextMenu = (event: MouseEvent, data: any) => {
  event.preventDefault()
  selectedNode.value = data
  contextMenuPosition.value = { x: event.clientX, y: event.clientY }
  contextMenuVisible.value = true

  // 点击其他地方关闭菜单
  const handleClickOutside = () => {
    contextMenuVisible.value = false
    document.removeEventListener('click', handleClickOutside)
  }

  nextTick(() => {
    document.addEventListener('click', handleClickOutside)
  })
}

// 处理菜单选择
const handleMenuSelect = (index: string) => {
  contextMenuVisible.value = false
  switch (index) {
    case 'newFile':
      newFileDialogVisible.value = true
      newFileName.value = ''
      break
    case 'newFolder':
      newFolderDialogVisible.value = true
      newFolderName.value = ''
      break
    case 'rename':
      if (selectedNode.value) {
        newFileName.value = selectedNode.value.label
        renameDialogVisible.value = true
      }
      break
    case 'delete':
      if (selectedNode.value) {
        deleteDialogVisible.value = true
      }
      break
  }
}

// 确认删除
const confirmDelete = async () => {
  if (!selectedNode.value) return

  try {
    const success = await window.electronAPI.deleteFile(selectedNode.value.path)
    if (success) {
      ElMessage.success('删除成功')
      // TODO: 重新加载文件树
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    ElMessage.error('删除失败')
    console.error('Error deleting file:', error)
  }

  deleteDialogVisible.value = false
  selectedNode.value = null
}

// 确认重命名
const confirmRename = async () => {
  if (!selectedNode.value || !newFileName.value) return

  try {
    const dirPath = selectedNode.value.path.substring(0, selectedNode.value.path.lastIndexOf('/'))
    const newPath = `${dirPath}/${newFileName.value}`
    const success = await window.electronAPI.renameFile(selectedNode.value.path, newPath)
    if (success) {
      ElMessage.success('重命名成功')
      // TODO: 重新加载文件树
    } else {
      ElMessage.error('重命名失败')
    }
  } catch (error) {
    ElMessage.error('重命名失败')
    console.error('Error renaming file:', error)
  }

  renameDialogVisible.value = false
  selectedNode.value = null
}

// 确认新建文件
const confirmNewFile = async () => {
  if (!newFileName.value) return

  try {
    const dirPath = selectedNode.value?.type === 'folder'
      ? selectedNode.value.path
      : folderPath.value
    const newPath = `${dirPath}/${newFileName.value}`
    const success = await window.electronAPI.createFile(newPath, '')
    if (success) {
      ElMessage.success('新建文件成功')
      // TODO: 重新加载文件树
    } else {
      ElMessage.error('新建文件失败')
    }
  } catch (error) {
    ElMessage.error('新建文件失败')
    console.error('Error creating file:', error)
  }

  newFileDialogVisible.value = false
  newFileName.value = ''
}

// 确认新建文件夹
const confirmNewFolder = async () => {
  if (!newFolderName.value) return

  try {
    const dirPath = selectedNode.value?.type === 'folder'
      ? selectedNode.value.path
      : folderPath.value
    const newPath = `${dirPath}/${newFolderName.value}`
    const success = await window.electronAPI.createFolder(newPath)
    if (success) {
      ElMessage.success('新建文件夹成功')
      // TODO: 重新加载文件树
    } else {
      ElMessage.error('新建文件夹失败')
    }
  } catch (error) {
    ElMessage.error('新建文件夹失败')
    console.error('Error creating folder:', error)
  }

  newFolderDialogVisible.value = false
  newFolderName.value = ''
}

// 重置重命名
const resetRename = () => {
  renameDialogVisible.value = false
  newFileName.value = ''
  selectedNode.value = null
}

// 重置新建文件
const resetNewFile = () => {
  newFileDialogVisible.value = false
  newFileName.value = ''
}

// 重置新建文件夹
const resetNewFolder = () => {
  newFolderDialogVisible.value = false
  newFolderName.value = ''
}

// 监听文件夹打开事件
onMounted(() => {
  window.electronAPI.onFolderOpened((data: { folderPath: string; fileTree: FileNode[] }) => {
    folderPath.value = data.folderPath
    fileTree.value = data.fileTree
    // 计算文件数量
    const countFiles = (nodes: FileNode[]): number => {
      let count = 0
      for (const node of nodes) {
        if (node.type === 'file') count++
        if (node.children) count += countFiles(node.children)
      }
      return count
    }
    ElMessage.success(`已加载 ${countFiles(data.fileTree)} 个 Markdown 文件`)
  })
})
</script>

<style lang="scss" scoped>
.document-tree {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background: #ffffff;

  .folder-info {
    flex-shrink: 0;
    padding: 8px 12px;
    background: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #333333;
    font-size: 13px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .el-icon {
      font-size: 14px;
      color: #333333;
    }
  }

  .el-tree {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0;
    background: #ffffff;

    :deep(.el-tree-node__content) {
      height: 22px;
      padding: 0 4px;
      margin: 2px 4px;
      border-radius: 3px;
      background: transparent;
      color: #333333;
      font-size: 13px;

      &:hover {
        background: #f0f0f0;
      }
    }

    :deep(.el-tree-node.is-current > .el-tree-node__content) {
      background: #e6f7ff;
    }

    :deep(.el-tree-node__expand-icon) {
      padding: 0;
      width: 16px;
      color: #999999;
      font-size: 12px;

      &:hover {
        color: #333333;
      }
    }
  }

  .empty-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999999;
  }

  .context-menu {
    position: fixed;
    z-index: 1000;
    background: #ffffff;
    border: 1px solid #e0e0e0;

    .el-menu-item {
      padding: 0 12px;
      height: 30px;
      line-height: 30px;
      color: #333333;
      font-size: 13px;
      background: transparent;

      &:hover {
        background: #f0f0f0;
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>