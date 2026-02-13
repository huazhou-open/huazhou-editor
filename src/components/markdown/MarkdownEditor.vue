<template>
  <div class="markdown-editor">
    <div v-if="!currentFile" class="welcome">
      <el-empty description="请选择一个 Markdown 文件" />
    </div>
    <div v-else class="editor-container">
      <div class="editor-header">
        <span class="file-name">{{ fileName }}</span>
        <el-space>
          <el-button type="primary" size="small" @click="saveFile">
            <el-icon><DocumentAdd /></el-icon>
            保存
          </el-button>
          <el-button type="danger" size="small" @click="closeFile">
            <el-icon><Close /></el-icon>
            关闭
          </el-button>
        </el-space>
      </div>
      <div ref="editorRef" class="vditor-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick } from 'vue'
import { DocumentAdd, Close } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import type { Instance } from 'vditor'

// 路径处理工具函数
const dirname = (filePath: string): string => {
  const parts = filePath.split('/')
  parts.pop()
  return parts.join('/')
}

const joinPath = (...parts: string[]): string => {
  return parts.filter(p => p).join('/')
}

const currentFile = ref<string>('')
const fileName = ref<string>('')
const editorRef = ref<HTMLElement | null>(null)
const vditorReady = ref(false)
const pendingContent = ref<string>('')
let vditor: Instance | null = null

// 监听编辑器就绪状态，设置待显示的内容
watch(vditorReady, (ready) => {
  if (ready && vditor && pendingContent.value) {
    console.log('[Vditor] Setting pending content')
    vditor.setValue(pendingContent.value)
    pendingContent.value = ''
  }
})

// 监听属性变化
const props = defineProps<{
  fileToLoad?: string
}>()

// 监听文件加载事件
watch(
  () => props.fileToLoad,
  async (newFile: string | undefined) => {
    if (newFile) {
      await loadFile(newFile)
    }
  }
)

// 初始化编辑器
const initEditor = () => {
  if (!editorRef.value || vditor) return

  vditor = new Vditor(editorRef.value, {
    height: '100%',
    mode: 'wysiwyg', // 所见即所得模式（类似 Typora）
    placeholder: '开始输入...',
    theme: 'classic',
    icon: 'ant',
    toolbar: [
      'headings',
      'bold',
      'italic',
      'strike',
      '|',
      'list',
      'ordered-list',
      'check',
      '|',
      'quote',
      'code',
      'inline-code',
      '|',
      'link',
      'table',
      '|',
      'undo',
      'redo',
      '|',
      'preview',
      'fullscreen',
    ],
    cache: {
      enable: false, // 禁用本地缓存，我们手动保存
    },
    upload: {
      // 处理图片上传
      handler: (files: File[]) => {
        return handleImageUpload(files)
      },
      // 图片最大 10MB
      max: 10 * 1024 * 1024,
      // 允许的文件格式
      allow: (file: File) => {
        const isImage = file.type.startsWith('image/')
        if (!isImage) {
          ElMessage.error('只能上传图片文件')
          return false
        }
        const isLt10M = file.size <= 10 * 1024 * 1024
        if (!isLt10M) {
          ElMessage.error('图片大小不能超过 10MB')
          return false
        }
        return true
      },
    },
    after: () => {
      console.log('[Vditor] Editor initialized')
      vditorReady.value = true
    },
    input: (value: string) => {
      // 输入时触发自动保存
      content.value = value
      debouncedSave()
    },
  })
}

// 处理图片上传
const handleImageUpload = async (files: File[]): Promise<string> => {
  if (files.length === 0) {
    return ''
  }

  const file = files[0]
  if (!currentFile.value) {
    ElMessage.warning('请先打开一个文件')
    return ''
  }

  try {
    // 获取当前文件所在目录
    const currentDir = dirname(currentFile.value)
    // 创建 assets 文件夹
    const assetsDir = joinPath(currentDir, 'assets')

    // 生成唯一文件名
    const timestamp = Date.now()
    const ext = file.name.split('.').pop()
    const fileName = `image-${timestamp}.${ext}`
    const imagePath = joinPath(assetsDir, fileName)

    // 读取文件内容
    const buffer = await file.arrayBuffer()
    const imageBuffer = Buffer.from(buffer)

    // 保存图片
    const savedPath = await window.electronAPI.saveImage(imageBuffer, imagePath)

    // 返回相对路径用于 Markdown
    const relativePath = `assets/${fileName}`
    console.log('[Image] Saved to:', savedPath, 'Relative:', relativePath)

    return relativePath
  } catch (error) {
    console.error('[Image] Upload error:', error)
    ElMessage.error('图片保存失败')
    return ''
  }
}

// 文件内容
const content = ref<string>('')

// 自动保存防抖
let saveTimeout: number | null = null
const debouncedSave = () => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  saveTimeout = window.setTimeout(async () => {
    if (currentFile.value && content.value) {
      await window.electronAPI.saveMarkdownFile(currentFile.value, content.value)
    }
  }, 2000) // 2秒后自动保存
}

// 加载文件
const loadFile = async (filePath: string) => {
  try {
    console.log('[Renderer] Loading file:', filePath)
    if (!filePath) {
      ElMessage.error('文件路径为空')
      return
    }

    currentFile.value = filePath
    fileName.value = filePath.split('/').pop() || filePath

    const fileContent = await window.electronAPI.readMarkdownFile(filePath)
    console.log('[Renderer] File content received, length:', fileContent?.length || 0)

    if (fileContent === undefined) {
      ElMessage.error('读取文件返回 undefined')
      return
    }

    content.value = fileContent

    // 确保编辑器已初始化
    await nextTick()
    if (!vditor) {
      console.log('[Renderer] Initializing editor...')
      initEditor()
    }

    // 如果编辑器已就绪，直接设置内容；否则等待就绪
    if (vditorReady.value && vditor) {
      console.log('[Renderer] Setting content directly')
      await vditor.setValue(fileContent)
    } else {
      console.log('[Renderer] Editor not ready, storing pending content')
      pendingContent.value = fileContent
    }
  } catch (error) {
    ElMessage.error(`读取文件失败: ${error}`)
    console.error('[Renderer] Error reading file:', error)
  }
}

// 保存文件
const saveFile = async () => {
  if (!currentFile.value) {
    ElMessage.warning('请先加载文件')
    return
  }

  try {
    // 获取编辑器当前内容
    if (vditor) {
      content.value = vditor.getValue()
    }

    const success = await window.electronAPI.saveMarkdownFile(currentFile.value, content.value)
    if (success) {
      ElMessage.success('文件保存成功')
    } else {
      ElMessage.error('文件保存失败')
    }
  } catch (error) {
    ElMessage.error('保存文件失败')
    console.error('Error saving file:', error)
  }
}

// 关闭文件
const closeFile = async () => {
  if (!currentFile.value) return

  try {
    await ElMessageBox.confirm('关闭文件将清空编辑器内容，是否继续？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    currentFile.value = ''
    fileName.value = ''
    content.value = ''
    if (vditor) {
      vditor.setValue('')
    }
  } catch (error) {
    // 用户取消操作
  }
}

// 清理
onBeforeUnmount(() => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  if (vditor) {
    vditor.destroy()
    vditor = null
  }
})
</script>

<style lang="scss" scoped>
.markdown-editor {
  height: 100%;
  display: flex;
  flex-direction: column;

  .welcome {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .editor-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .editor-header {
      flex-shrink: 0;
      padding: 12px 16px;
      background: #f5f5f5;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .file-name {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 300px;
      }
    }

    .vditor-container {
      flex: 1;
      overflow: hidden;

      :deep(.vditor) {
        border: none;
        height: 100%;

        .vditor-toolbar {
          border-bottom: 1px solid #e0e0e0;
          background: #fafafa;
        }

        .vditor-content {
          height: calc(100% - 44px);
        }
      }
    }
  }
}
</style>
