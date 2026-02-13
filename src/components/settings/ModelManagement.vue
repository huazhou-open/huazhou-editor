<template>
  <div class="model-management">
    <!-- 提供商列表（左侧） -->
    <div class="provider-list">
      <div class="list-header">
        <h3>提供商</h3>
        <el-button :icon="Plus" circle size="small" @click="handleAddProvider" />
      </div>
      <div class="provider-items">
        <div
          v-for="provider in providers"
          :key="provider.id"
          :class="['provider-item', { active: selectedProviderId === provider.id }]"
          @click="selectedProviderId = provider.id"
        >
          <span class="provider-name">{{ provider.name }}</span>
          <el-icon v-if="selectedProviderId === provider.id" class="check-icon">
            <Check />
          </el-icon>
        </div>
      </div>
    </div>

    <!-- 提供商详情和模型列表（右侧） -->
    <div v-if="selectedProvider" class="provider-detail">
      <!-- 提供商基础信息 -->
      <div class="provider-info">
        <div class="info-header">
          <h3>{{ selectedProvider.name }}</h3>
          <el-space>
            <el-button size="small" @click="handleEditProvider">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDeleteProvider">删除</el-button>
          </el-space>
        </div>
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="API 端点">
            {{ selectedProvider.apiEndpoint }}
          </el-descriptions-item>
          <el-descriptions-item label="API 密钥">
            {{ maskApiKey(selectedProvider.apiKey) }}
          </el-descriptions-item>
          <el-descriptions-item label="模型数量" :span="2">
            {{ selectedProvider.models.length }} 个
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 模型列表 -->
      <div class="models-section">
        <div class="section-header">
          <h4>模型列表</h4>
          <el-button type="primary" :icon="Plus" size="small" @click="handleAddModel">
            添加模型
          </el-button>
        </div>
        <div v-if="selectedProvider.models.length > 0" class="models-grid">
          <div v-for="model in selectedProvider.models" :key="model.id" class="model-card">
            <div class="card-header">
              <div class="model-title">
                <span class="model-name">{{ model.name }}</span>
                <el-tag v-if="model.isDefault" type="success" size="small">默认</el-tag>
              </div>
              <el-switch
                v-model="model.enabled"
                size="small"
                @change="handleToggleModel(model)"
              />
            </div>
            <div class="card-body">
              <div class="info-row">
                <span class="label">模型标识:</span>
                <span class="value">{{ model.modelId }}</span>
              </div>
              <div class="info-row">
                <span class="label">最大令牌:</span>
                <span class="value">{{ model.maxTokens }}</span>
              </div>
              <div class="info-row">
                <span class="label">温度:</span>
                <span class="value">{{ model.temperature }}</span>
              </div>
            </div>
            <div class="card-footer">
              <el-space>
                <el-button
                  v-if="!model.isDefault"
                  link
                  type="primary"
                  size="small"
                  @click="handleSetDefault(model)"
                >
                  设为默认
                </el-button>
                <el-button link type="primary" size="small" @click="handleEditModel(model)">
                  编辑
                </el-button>
                <el-button link type="danger" size="small" @click="handleDeleteModel(model)">
                  删除
                </el-button>
              </el-space>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无模型" :image-size="100" />
      </div>
    </div>

    <el-empty v-else description="请选择或添加一个提供商" :image-size="150" />

    <!-- 添加/编辑提供商对话框 -->
    <el-dialog
      v-model="showProviderDialog"
      :title="isEditingProvider ? '编辑提供商' : '添加提供商'"
      width="500px"
      @close="resetProviderForm"
    >
      <el-form :model="providerForm" :rules="providerRules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="providerForm.name" placeholder="例如: OpenAI" />
        </el-form-item>
        <el-form-item label="API 端点" prop="apiEndpoint">
          <el-input
            v-model="providerForm.apiEndpoint"
            placeholder="https://api.openai.com/v1"
          />
        </el-form-item>
        <el-form-item label="API 密钥" prop="apiKey">
          <el-input
            v-model="providerForm.apiKey"
            type="password"
            placeholder="sk-..."
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showProviderDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSaveProvider">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加/编辑模型对话框 -->
    <el-dialog
      v-model="showModelDialog"
      :title="isEditingModel ? '编辑模型' : '添加模型'"
      width="500px"
      @close="resetModelForm"
    >
      <el-form :model="modelForm" :rules="modelRules" label-width="100px">
        <el-form-item label="模型名称" prop="name">
          <el-input v-model="modelForm.name" placeholder="例如: GPT-4" />
        </el-form-item>
        <el-form-item label="模型标识" prop="modelId">
          <el-input v-model="modelForm.modelId" placeholder="gpt-4" />
        </el-form-item>
        <el-form-item label="最大令牌" prop="maxTokens">
          <el-input-number v-model="modelForm.maxTokens" :min="1" :max="100000" />
        </el-form-item>
        <el-form-item label="温度" prop="temperature">
          <el-input-number
            v-model="modelForm.temperature"
            :min="0"
            :max="2"
            :step="0.1"
            :precision="1"
          />
        </el-form-item>
        <el-form-item label="是否启用" prop="enabled">
          <el-switch v-model="modelForm.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showModelDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSaveModel">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Check } from '@element-plus/icons-vue'
import type { ProviderConfig, ModelInfo } from '@/types/config'

// 提供商列表
const providers = ref<ProviderConfig[]>([])
const selectedProviderId = ref<string>('')

// 计算当前选中的提供商
const selectedProvider = computed(() => {
  return providers.value.find(p => p.id === selectedProviderId.value)
})

// 提供商对话框
const showProviderDialog = ref(false)
const isEditingProvider = ref(false)
const editingProviderId = ref('')
const providerForm = reactive<Partial<ProviderConfig>>({
  name: '',
  apiEndpoint: '',
  apiKey: ''
})

const providerRules = {
  name: [{ required: true, message: '请输入提供商名称', trigger: 'blur' }],
  apiEndpoint: [{ required: true, message: '请输入 API 端点', trigger: 'blur' }],
  apiKey: [{ required: true, message: '请输入 API 密钥', trigger: 'blur' }]
}

// 模型型对话框
const showModelDialog = ref(false)
const isEditingModel = ref(false)
const editingModelId = ref('')
const modelForm = reactive<Partial<ModelInfo>>({
  name: '',
  modelId: '',
  maxTokens: 4096,
  temperature: 0.7,
  enabled: true,
  isDefault: false
})

const modelRules = {
  name: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
  modelId: [{ required: true, message: '请输入模型标识', trigger: 'blur' }],
  maxTokens: [{ required: true, message: '请输入最大令牌数', trigger: 'blur' }],
  temperature: [{ required: true, message: '请输入温度值', trigger: 'blur' }]
}

// 从配置文件加载提供商数据
const loadProviders = async () => {
  try {
    const result = await window.electronAPI.getProviders()
    providers.value = (result as ProviderConfig[]) || []
  } catch (error) {
    console.error('加载提供商数据失败:', error)
    ElMessage.error('加载提供商数据失败')
  }
}

// 保存提供商数据到配置文件
const saveProviders = async () => {
  try {
    console.log('Calling saveProviders with:', providers.value)
    console.log('window.electronAPI.saveProviders exists:', typeof window.electronAPI.saveProviders)
    // 将响应式数据转换为纯 JSON 对象，去除 Vue 内部属性，避免序列化错误
    const plainProviders = JSON.parse(JSON.stringify(providers.value))
    const result = await window.electronAPI.saveProviders(plainProviders)
    console.log('saveProviders result:', result)
    if (result && (result as any).error) {
      ElMessage.error('保存失败: ' + (result as any).error)
      return false
    }
    return true
  } catch (error) {
    console.error('保存提供商数据失败:', error)
    ElMessage.error('保存提供商数据失败: ' + String(error))
    return false
  }
}

// 遮盖 API 密钥
const maskApiKey = (key: string) => {
  if (!key) return ''
  if (key.length <= 8) return '****'
  return key.substring(0, 4) + '****' + key.substring(key.length - 4)
}

// 提供商操作
const handleAddProvider = () => {
  isEditingProvider.value = false
  editingProviderId.value = ''
  resetProviderForm()
  showProviderDialog.value = true
}

const handleEditProvider = () => {
  if (!selectedProvider.value) return
  isEditingProvider.value = true
  editingProviderId.value = selectedProvider.value.id
  Object.assign(providerForm, {
    name: selectedProvider.value.name,
    apiEndpoint: selectedProvider.value.apiEndpoint,
    apiKey: selectedProvider.value.apiKey
  })
  showProviderDialog.value = true
}

const handleSaveProvider = async () => {
  if (!providerForm.name || !providerForm.apiEndpoint || !providerForm.apiKey) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (isEditingProvider.value) {
    // 编辑
    const provider = providers.value.find(p => p.id === editingProviderId.value)
    if (provider) {
      provider.name = providerForm.name
      provider.apiEndpoint = providerForm.apiEndpoint
      provider.apiKey = providerForm.apiKey
    }
    ElMessage.success('更新成功')
  } else {
    // 新增
    const newProvider: ProviderConfig = {
      id: Date.now().toString(),
      name: providerForm.name,
      apiEndpoint: providerForm.apiEndpoint,
      apiKey: providerForm.apiKey,
      models: []
    }
    providers.value.push(newProvider)
    selectedProviderId.value = newProvider.id
    ElMessage.success('添加成功')
  }

  const saved = await saveProviders()
  if (saved) {
    showProviderDialog.value = false
    resetProviderForm()
  }
}

const handleDeleteProvider = async () => {
  ElMessageBox.confirm('确定要删除这个提供商及其所有模型吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      if (!selectedProvider.value) return
      const index = providers.value.findIndex(p => p.id === selectedProvider.value.id)
      if (index > -1) {
        providers.value.splice(index, 1)
        selectedProviderId.value = ''
        const saved = await saveProviders()
        if (saved) {
          ElMessage.success('删除成功')
        }
      }
    })
    .catch(() => {})
}

const resetProviderForm = () => {
  Object.assign(providerForm, {
    name: '',
    apiEndpoint: '',
    apiKey: ''
  })
}

// 模型操作
const handleAddModel = () => {
  if (!selectedProvider.value) return
  isEditingModel.value = false
  editingModelId.value = ''
  resetModelForm()
  showModelDialog.value = true
}

const handleEditModel = (model: ModelInfo) => {
  isEditingModel.value = true
  editingModelId.value = model.id
  Object.assign(modelForm, model)
  showModelDialog.value = true
}

const handleSaveModel = async () => {
  if (
    !modelForm.name ||
    !modelForm.modelId ||
    modelForm.maxTokens === undefined ||
    modelForm.temperature === undefined
  ) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (!selectedProvider.value) return

  if (isEditingModel.value) {
    // 编辑
    const model = selectedProvider.value.models.find(m => m.id === editingModelId.value)
    if (model) {
      Object.assign(model, modelForm)
    }
    ElMessage.success('更新成功')
  } else {
    // 新增
    const newModel: ModelInfo = {
      id: Date.now().toString(),
      name: modelForm.name,
      modelId: modelForm.modelId,
      maxTokens: modelForm.maxTokens,
      temperature: modelForm.temperature,
      enabled: modelForm.enabled,
      isDefault: selectedProvider.value.models.length === 0
    }
    selectedProvider.value.models.push(newModel)
  }

  const saved = await saveProviders()
  if (saved) {
    ElMessage.success('添加成功')
    showModelDialog.value = false
    resetModelForm()
  }
}

const handleSetDefault = async (model: ModelInfo) => {
  if (!selectedProvider.value) return
  selectedProvider.value.models.forEach(m => (m.isDefault = m.id === model.id))
  const saved = await saveProviders()
  if (saved) {
    ElMessage.success('已设为默认模型')
  }
}

const handleDeleteModel = async (model: ModelInfo) => {
  ElMessageBox.confirm('确定要删除这个模型吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      if (!selectedProvider.value) return
      const index = selectedProvider.value.models.findIndex(m => m.id === model.id)
      if (index > -1) {
        selectedProvider.value.models.splice(index, 1)
        const saved = await saveProviders()
        if (saved) {
          ElMessage.success('删除成功')
        }
      }
    })
    .catch(() => {})
}

const handleToggleModel = async (model: ModelInfo) => {
  const saved = await saveProviders()
  if (saved) {
    if (model.enabled) {
      ElMessage.success('模型已启用')
    } else {
      ElMessage.info('模型已禁用')
    }
  }
}

const resetModelForm = () => {
  Object.assign(modelForm, {
    name: '',
    modelId: '',
    maxTokens: 4096,
    temperature: 0.7,
    enabled: true,
    isDefault: false
  })
}

// 组件挂载时加载数据
onMounted(async () => {
  await loadProviders()
  if (providers.value.length > 0) {
    selectedProviderId.value = providers.value[0].id
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.model-management {
  display: flex;
  gap: $spacing-lg;
  height: 100%;

  // 左侧提供商列表
  .provider-list {
    width: 200px;
    display: flex;
    flex-direction: column;
    background: #f5f5f5;
    border-radius: 8px;
    padding: $spacing-md;

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-md;

      h3 {
        margin: 0;
        font-size: 16px;
        color: $text-color-primary;
      }
    }

    .provider-items {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
    }

    .provider-item {
      padding: $spacing-sm $spacing-md;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: $text-color-primary;

      &:hover {
        background: #e0e0e0;
      }

      &.active {
        background: $primary-color;
        color: white;

        .check-icon {
          color: white;
        }
      }

      .provider-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  // 右侧提供商详情
  .provider-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
    overflow: hidden;

    .provider-info {
      .info-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $spacing-md;

        h3 {
          margin: 0;
          font-size: 18px;
          color: $text-color-primary;
        }
      }
    }

    .models-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $spacing-md;

        h4 {
          margin: 0;
          font-size: 16px;
          color: $text-color-primary;
        }
      }

      .models-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: $spacing-md;
        overflow-y: auto;
        padding: 2px;
      }

      .model-card {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: $spacing-md;
        transition: all 0.2s;

        &:hover {
          box-shadow: $box-shadow-base;
          border-color: $primary-color;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: $spacing-sm;

          .model-title {
            display: flex;
            align-items: center;
            gap: $spacing-xs;

            .model-name {
              font-size: 15px;
              font-weight: 500;
              color: $text-color-primary;
            }
          }
        }

        .card-body {
          margin-bottom: $spacing-md;

          .info-row {
            display: flex;
            margin-bottom: $spacing-xs;
            font-size: 13px;

            .label {
              color: $text-color-secondary;
              width: 70px;
              flex-shrink: 0;
            }

            .value {
              color: $text-color-primary;
              flex: 1;
            }
          }
        }

        .card-footer {
          border-top: 1px solid #f0f0f0;
          padding-top: $spacing-sm;
        }
      }
    }
  }
}
</style>
