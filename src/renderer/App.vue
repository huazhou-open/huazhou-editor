<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Edit } from '@element-plus/icons-vue';
import { useConfig } from './composables/useConfig';
import ConfigView from './components/ConfigView.vue';

const currentView = ref<'main' | 'config'>('main');

const {
  loadConfig
} = useConfig();

function handleOpenConfig() {
  currentView.value = 'config';
}

function handleCloseConfig() {
  currentView.value = 'main';
}

watch(currentView, async (newView) => {
  if (newView === 'config') {
    await loadConfig();
  }
});

onMounted(() => {
  window.electronAPI.onOpenConfig(handleOpenConfig);
});
</script>

<template>
  <div id="app">
    <!-- Main View -->
    <div v-if="currentView === 'main'" class="main-view">
      <el-empty description="欢迎使用花洲 Markdown 编辑器">
        <template #image>
          <el-icon :size="100" color="#409eff">
            <Edit />
          </el-icon>
        </template>
        <el-button type="primary" @click="handleOpenConfig">
          打开配置
        </el-button>
      </el-empty>
    </div>

    <!-- Config View -->
    <ConfigView v-else @close="handleCloseConfig" />
  </div>
</template>

<style>
/* 全局重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
  width: 100%;
}

/* 主界面 */
.main-view {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}
</style>
