<template>
  <div class="model-management">
    <div class="page-header">
      <h2>模型管理</h2>
      <el-button type="primary" :icon="Plus" @click="showAddDialog = true">
        添加模型
      </el-button>
    </div>

    <!-- 模型列表 -->
    <el-table :data="models" stripe>
      <el-table-column prop="name" label="模型名称" />
      <el-table-column prop="provider" label="提供商" />
      <el-table-column prop="apiEndpoint" label="API 端点" />
      <el-table-column prop="maxTokens" label="最大令牌" width="120" />
      <el-table-column prop="temperature" label="温度" width="100" />
      <el-table-column label="默认" width="80">
        <template #default="{ row }">
          <el-tag v-if="row.isDefault" type="success" size="small">默认</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button
            v-if="!row.isDefault"
            link
            type="primary"
            size="small"
            @click="handleSetDefault(row)"
          >
            设为默认
          </el-button>
          <el-button
            link
            type="danger"
            size="small"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加模型对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="添加模型"
      width="500px"
      @close="resetForm"
    >
      <el-form :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="模型名称" prop="name">
          <el-input v-model="formData.name" placeholder="例如: GPT-4" />
        </el-form-item>
        <el-form-item label="提供商" prop="provider">
          <el-select v-model="formData.provider" placeholder="选择提供商">
            <el-option label="OpenAI" value="openai" />
            <el-option label="Anthropic" value="anthropic" />
            <el-option label="Azure" value="azure" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="API 密钥" prop="apiKey">
          <el-input
            v-model="formData.apiKey"
            type="password"
            placeholder="sk-..."
            show-password
          />
        </el-form-item>
        <el-form-item label="API 端点" prop="apiEndpoint">
          <el-input
            v-model="formData.apiEndpoint"
            placeholder="https://api.openai.com/v1"
          />
        </el-form-item>
        <el-form-item label="最大令牌">
          <el-input-number v-model="formData.maxTokens" :min="1" :max="100000" />
        </el-form-item>
        <el-form-item label="温度">
          <el-input-number
            v-model="formData.temperature"
            :min="0"
            :max="2"
            :step="0.1"
            :precision="1"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAdd">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { ModelConfig } from '@/types/config'

// 模拟数据（实际应从 store 读取）
const models = ref<ModelConfig[]>([
  {
    id: '1',
    name: 'GPT-4',
    provider: 'openai',
    apiEndpoint: 'https://api.openai.com/v1',
    isDefault: true,
    maxTokens: 4096,
    temperature: 0.7
  }
])

const showAddDialog = ref(false)
const formData = reactive<Partial<ModelConfig>>({
  name: '',
  provider: '',
  apiKey: '',
  apiEndpoint: '',
  maxTokens: 4096,
  temperature: 0.7,
  isDefault: false
})

const formRules = {
  name: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
  provider: [{ required: true, message: '请选择提供商', trigger: 'change' }]
}

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    provider: '',
    apiKey: '',
    apiEndpoint: '',
    maxTokens: 4096,
    temperature: 0.7,
    isDefault: false
  })
}

const handleAdd = () => {
  if (!formData.name || !formData.provider) {
    ElMessage.warning('请填写必填项')
    return
  }

  const newModel: ModelConfig = {
    id: Date.now().toString(),
    name: formData.name,
    provider: formData.provider,
    apiKey: formData.apiKey,
    apiEndpoint: formData.apiEndpoint,
    maxTokens: formData.maxTokens,
    temperature: formData.temperature,
    isDefault: false
  }

  models.value.push(newModel)
  showAddDialog.value = false
  ElMessage.success('添加成功')
  resetForm()
}

const handleSetDefault = (row: ModelConfig) => {
  models.value.forEach(m => (m.isDefault = m.id === row.id))
  ElMessage.success('已设为默认模型')
}

const handleDelete = (row: ModelConfig) => {
  ElMessageBox.confirm('确定要删除这个模型吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const index = models.value.findIndex(m => m.id === row.id)
      if (index > -1) {
        models.value.splice(index, 1)
        ElMessage.success('删除成功')
      }
    })
    .catch(() => {})
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.model-management {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-lg;

    h2 {
      margin: 0;
      font-size: 20px;
      color: $text-color-primary;
    }
  }
}
</style>
