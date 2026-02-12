<template>
  <div class="home-container">
    <el-container>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="welcome-card">
              <template #header>
                <div class="card-header">
                  <el-icon><ElementPlus /></el-icon>
                  <span>Welcome</span>
                </div>
              </template>
              <p>您的 Electron + Vue3 + Element Plus + TypeScript 项目已就绪！</p>
              <el-button type="primary" @click="handleClick">
                Click Me
              </el-button>
              <p v-if="clickCount > 0">Clicked {{ clickCount }} times</p>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="info-card">
              <template #header>
                <div class="card-header">
                  <el-icon><InfoFilled /></el-icon>
                  <span>Tech Stack</span>
                </div>
              </template>
              <el-space wrap>
                <el-tag type="success">Electron</el-tag>
                <el-tag type="primary">Vue 3</el-tag>
                <el-tag type="warning">TypeScript</el-tag>
                <el-tag type="danger">Element Plus</el-tag>
              </el-space>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const clickCount = ref(0)

const handleClick = () => {
  clickCount.value++
  ElMessage.success(`Button clicked ${clickCount.value} times!`)
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.home-container {
  width: 100%;
  height: 100%;
  background: $background-color-base;
}

.el-main {
  padding: 20px;
}

.welcome-card,
.info-card {
  min-height: 200px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.el-space {
  margin-top: $spacing-sm;
}
</style>
