<template>
  <div class="settings-group">
    <el-menu
      :default-active="activeKey"
      class="settings-menu"
      @select="handleSelect"
    >
      <el-menu-item index="models">
        <el-icon><Connection /></el-icon>
        <span>模型管理</span>
      </el-menu-item>
      <el-menu-item index="basic">
        <el-icon><Setting /></el-icon>
        <span>基础配置</span>
      </el-menu-item>
      <el-menu-item index="appearance">
        <el-icon><Brush /></el-icon>
        <span>外观设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const activeKey = ref('models')

// 监听路由变化，更新选中的菜单项
watch(
  () => route.path,
  (path) => {
    const match = path.match(/\/settings\/(\w+)/)
    if (match) {
      activeKey.value = match[1]
    }
  },
  { immediate: true }
)

const handleSelect = (key: string) => {
  router.push(`/settings/${key}`)
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.settings-group {
  height: 100%;
}

.settings-menu {
  height: 100%;
  border-right: none;
  background: transparent;
}

.el-menu-item {
  &:hover {
    background: $border-color-extra-light;
  }

  &.is-active {
    background: $primary-color;
    color: white;
  }
}
</style>
