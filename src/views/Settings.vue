<template>
  <div class="settings-container">
    <el-container class="settings-content">
      <!-- 左侧设置分组 -->
      <el-aside width="200px">
        <settings-group />
      </el-aside>

      <!-- 右侧设置内容 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import SettingsGroup from '@/components/settings/SettingsGroup.vue'
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.settings-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: $background-color-base;
}

.settings-content {
  height: 100%;
  background: white;
}

.el-aside {
  border-right: 1px solid $border-color-light;
  background: $background-color-base;
}

.el-main {
  padding: $spacing-lg;
  overflow-y: auto;
}
</style>
