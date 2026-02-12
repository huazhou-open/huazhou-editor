<template>
  <div class="appearance-config">
    <h2>外观设置</h2>

    <el-form :model="config" label-width="120px" class="config-form">
      <el-form-item label="主题模式">
        <el-radio-group v-model="config.theme">
          <el-radio label="light">浅色</el-radio>
          <el-radio label="dark">深色</el-radio>
          <el-radio label="auto">跟随系统</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="字体大小">
        <el-select v-model="config.fontSize">
          <el-option label="小 (12px)" value="small" />
          <el-option label="默认 (14px)" value="default" />
          <el-option label="大 (16px)" value="large" />
        </el-select>
      </el-form-item>

      <el-form-item label="字体家族">
        <el-select v-model="config.fontFamily">
          <el-option label="系统默认" value="system" />
          <el-option label="微软雅黑" value="microsoft-yahei" />
          <el-option label="苹方" value="pingfang" />
          <el-option label="思源黑体" value="source-han-sans" />
        </el-select>
      </el-form-item>

      <el-form-item label="界面缩放">
        <el-select v-model="config.scale">
          <el-option label="100%" value="1.0" />
          <el-option label="110%" value="1.1" />
          <el-option label="125%" value="1.25" />
          <el-option label="150%" value="1.5" />
        </el-select>
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
import type { AppearanceConfig } from '@/types/config'

const defaultConfig: AppearanceConfig = {
  theme: 'auto',
  fontSize: 'default',
  fontFamily: 'system',
  scale: '1.0'
}

const config = reactive<AppearanceConfig>({ ...defaultConfig })

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

.appearance-config {
  h2 {
    margin: 0 0 $spacing-lg 0;
    font-size: 20px;
    color: $text-color-primary;
  }

  .config-form {
    max-width: 500px;
  }
}
</style>
