<script setup lang="ts">
import { defineProps, computed, ref, onMounted, watch } from 'vue';
import { useMarkdown } from '../composables/useMarkdown';

const props = defineProps<{
  viewMode: 'split' | 'inline';
  content: string;
}>();

const previewContent = ref('');
const inlinePreviewContent = ref('');

// Use markdown utils
const markdownUtils = useMarkdown(() => props.content);

// Update preview when content changes
watch(() => props.content, (newContent) => {
  const html = markdownUtils.parseMarkdown(newContent);
  previewContent.value = html;
  inlinePreviewContent.value = html;
}, { immediate: true });

// Handle scroll sync
const handleEditorScroll = (event: Event) => {
  // This will be handled by the parent or via event
  const detail = (event as CustomEvent).detail;
  const scrollInfo = detail.scrollInfo;

  if (props.viewMode === 'split') {
    const previewContainer = document.querySelector('.preview-container') as HTMLElement;
    if (previewContainer) {
      const scrollRatio = scrollInfo.top / (scrollInfo.height - scrollInfo.clientHeight);
      const previewHeight = previewContainer.scrollHeight - previewContainer.clientHeight;
      previewContainer.scrollTop = scrollRatio * previewHeight;
    }
  }
};

onMounted(() => {
  // Initialize with content
  const html = markdownUtils.parseMarkdown(props.content);
  previewContent.value = html;
  inlinePreviewContent.value = html;
});
</script>

<template>
  <div class="preview-panels">
    <!-- Split Mode -->
    <div v-if="viewMode === 'split'" class="split-mode">
      <div class="preview-panel">
        <div class="panel-header">
          <span class="panel-title">预览</span>
        </div>
        <div class="preview-container">
          <div v-html="previewContent" id="preview-content"></div>
        </div>
      </div>
    </div>

    <!-- Inline Mode -->
    <div v-else class="inline-mode">
      <div class="inline-preview" v-html="inlinePreviewContent"></div>
    </div>
  </div>
</template>

<style scoped>
.preview-panels {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.split-mode {
  display: flex;
  width: 100%;
}

.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preview-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
}

#preview-content {
    max-width: 800px;
    margin: 0 auto;
}

.inline-mode {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
}

.inline-preview {
  max-width: 800px;
  margin: 0 auto;
}

/* Markdown Styles */
:deep(#preview-content) h1,
:deep(.inline-preview) h1 {
  font-size: 2em;
  margin: 0.67em 0;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.3em;
}

:deep(#preview-content) h2,
:deep(.inline-preview) h2 {
  font-size: 1.5em;
  margin: 0.83em 0;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.3em;
}

:deep(#preview-content) h3,
:deep(.inline-preview) h3 {
  font-size: 1.17em;
  margin: 1em 0;
  color: var(--text-primary);
}

:deep(#preview-content) h4,
:deep(.inline-preview) h4 {
  font-size: 1em;
  margin: 1.33em 0;
  color: var(--text-primary);
}

:deep(#preview-content) h5,
:deep(.inline-preview) h5 {
  font-size: 0.83em;
  margin: 1.67em 0;
  color: var(--text-primary);
}

:deep(#preview-content) h6,
:deep(.inline-preview) h6 {
  font-size: 0.67em;
  margin: 2.33em 0;
  color: var(--text-secondary);
}

:deep(#preview-content) p,
:deep(.inline-preview) p {
  margin: 1em 0;
  line-height: 1.7;
  color: var(--text-primary);
}

:deep(#preview-content) a,
:deep(.inline-preview) a {
  color: var(--accent-color);
  text-decoration: none;
}

:deep(#preview-content) a:hover,
:deep(.inline-preview) a:hover {
  text-decoration: underline;
}

:deep(#preview-content) strong,
:deep(.inline-preview) strong {
  font-weight: 700;
}

:deep(#preview-content) em,
:deep(.inline-preview) em {
  font-style: italic;
}

:deep(#preview-content) del,
:deep(.inline-preview) del {
  text-decoration: line-through;
}

:deep(#preview-content) code,
:deep(.inline-preview) code {
  background-color: var(--bg-tertiary);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
}

:deep(#preview-content) pre,
:deep(.inline-preview) pre {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  margin: 1em 0;
}

:deep(#preview-content) pre code,
:deep(.inline-preview) pre code {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
}

:deep(#preview-content) blockquote,
:deep(.inline-preview) blockquote {
  border-left: 4px solid var(--accent-color);
  margin: 1em 0;
  padding: 0.5em 1em;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
}

:deep(#preview-content) ul,
:deep(.inline-preview) ul,
:deep(#preview-content) ol,
:deep(.inline-preview) ol {
  margin: 1em 0;
  padding-left: 2em;
}

:deep(#preview-content) ul,
:deep(.inline-preview) ul {
  list-style-type: disc;
}

:deep(#preview-content) ul ul,
:deep(.inline-preview) ul ul {
  list-style-type: circle;
}

:deep(#preview-content) li,
:deep(.inline-preview) li {
  margin: 0.5em 0;
  color: var(--text-primary);
}

:deep(#preview-content) ol,
:deep(.inline-preview) ol {
  list-style-type: decimal;
}

:deep(#preview-content) img,
:deep(.inline-preview) img {
  max-width: 100%;
  height: auto;
  margin: 1em 0;
  border-radius: 6px;
}

:deep(#preview-content) table,
:deep(.inline-preview) table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

:deep(#preview-content) th,
:deep(.inline-preview) th,
:deep(#preview-content) td,
:deep(.inline-preview) td {
  border: 1px solid var(--border-color);
  padding: 8px 12px;
  text-align: left;
}

:deep(#preview-content) th,
:deep(.inline-preview) th {
  background-color: var(--bg-secondary);
  font-weight: 600;
}

:deep(#preview-content) tr:nth-child(even),
:deep(.inline-preview) tr:nth-child(even) {
  background-color: var(--bg-secondary);
}

:deep(#preview-content) hr,
:deep(.inline-preview) hr {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 2em 0;
}

:deep(#preview-content) input[type="checkbox"],
:deep(.inline-preview) input[type="checkbox"] {
  margin-right: 8px;
}
</style>
