<template>
  <div class="basic-config">
    <h2>基础配置</h2>

    <el-form :model="config" label-width="120px" class="config-form">
      <el-form-item label="语言">
        <el-select v-model="config.language">
          <el-option label="简体中文" value="zh-CN" />
          <el-option label="English" value="en-US" />
          <el-option label="日本語" value="ja-JP" />
        </el-select>
      </el-form-item>

      <el-form-item label="数据存储路径">
        <el-input
          v-model="config.dataPath"
          placeholder="选择数据存储路径"
          readonly
        >
          <template #append>
            <el-button :icon="Folder" @click="selectDataPath">
              浏览
            </el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="自动保存">
        <el-switch v-model="config.autoSave" />
        <span class="form-tip">启用后自动保存编辑内容</span>
      </el-form-item>

      <el-form-item v-if="config.autoSave" label="保存间隔">
        <el-input-number
          v-model="config.autoSaveInterval"
          :min="10"
          :max="300"
          :step="10"
        />
        <span class="form-tip">秒（10-300秒）</span>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSave">保存配置</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Folder } from '@element-plus/icons-vue'
import type { BasicConfig } from '@/types/config'

const defaultConfig: BasicConfig = {
  language: 'zh-CN',
  dataPath: '',
  autoSave: true,
  autoSaveInterval: 30
}

const config = reactive<BasicConfig>({ ...defaultConfig })

const selectDataPath = () => {
  // TODO: 通过 IPC 调用主进程选择目录
  ElMessage.info('目录选择功能待实现')
}

const handleSave = () => {
  // TODO: 保存到 store
  ElMessage.success('配置已保存')
}

const handleReset = () => {
  Object.assign(config, defaultConfig)
  ElMessage.info('配置已重置')
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.basic-config {
  h2 {
    margin: 0 0 $spacing-lg 0;
    font-size: 20px;
    color: $text-color-primary;
  }

  .config-form {
    max-width: 500px;
  }

  .form-tip {
    margin-left: $spacing-sm;
    color: $text-color-secondary;
    font-size: $font-size-small;
  }
}
</style>
