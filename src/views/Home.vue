<template>
  <div class="home-container">
    <el-container class="container">
      <el-aside width="300px" class="sidebar">
        <DocumentTree @file-click="handleFileClick" />
      </el-aside>
      <el-main class="main-content">
        <MarkdownEditor :file-to-load="selectedFile" />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DocumentTree from '@/components/markdown/DocumentTree.vue'
import MarkdownEditor from '@/components/markdown/MarkdownEditor.vue'

const selectedFile = ref<string>('')

const handleFileClick = (filePath: string) => {
  selectedFile.value = filePath
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.home-container {
  width: 100%;
  height: 100%;
  background: $background-color-base;
}

.container {
  height: 100%;

  .sidebar {
    background: #f8f9fa;
    border-right: 1px solid #e0e0e0;
    overflow: hidden;
  }

  .main-content {
    background: #fff;
    overflow: hidden;
    padding: 0;
  }
}
</style>
