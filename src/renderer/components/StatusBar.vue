<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { useMarkdown } from '../composables/useMarkdown';

const props = defineProps<{
  content: string;
}>();

const markdownUtils = useMarkdown(() => props.content);

const stats = computed(() => {
  return markdownUtils.getStats(props.content);
});
</script>

<template>
  <div class="status-bar">
    <span>{{ stats.words }} 字</span>
    <span>{{ stats.lines }} 行</span>
    <span>{{ stats.chars }} 字符</span>
  </div>
</template>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--text-secondary);
  background-color: var(--toolbar-bg);
  border-top: 1px solid var(--border-color);
}
</style>
