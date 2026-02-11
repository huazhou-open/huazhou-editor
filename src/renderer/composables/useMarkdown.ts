import { ref, computed } from 'vue';

// Extended marked type
declare global {
  interface Window {
    marked: {
      parse: (markdown: string) => string;
    } | ((markdown: string) => string);
  }
}

export function useMarkdown(editorValue: () => string) {
  const parseMarkdown = (markdown: string): string => {
    try {
      if (typeof window.marked === 'function') {
        return window.marked(markdown);
      } else if (window.marked && typeof (window.marked as any).parse === 'function') {
        return (window.marked as any).parse(markdown);
      }
      return markdown;
    } catch (e) {
      console.error('Error parsing markdown:', e);
      return `<p>Error: ${(e as Error).message}</p>`;
    }
  };

  const previewHtml = computed(() => {
    return parseMarkdown(editorValue());
  });

  const updatePreview = (markdown: string): string => {
    return parseMarkdown(markdown);
  };

  const getStats = (content: string) => {
    const lines = content.split('\n').length;
    const chars = content.length;
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;

    return { words, lines, chars };
  };

  return {
    parseMarkdown,
    previewHtml,
    updatePreview,
    getStats
  };
}
