<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 监听来自主进程菜单的导航事件
onMounted(() => {
  window.electronAPI.onNavigate((path: string) => {
    router.push(path)
  })
})
</script>

<style lang="scss" scoped>
</style>
