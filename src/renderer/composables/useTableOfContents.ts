import { ref, computed } from 'vue';

export interface TOCItem {
  level: number;
  text: string;
  line: number;
}

export function useTableOfContents() {
  const items = ref<TOCItem[]>([]);

  const updateTOC = (content: string) => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: TOCItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2];
      const line = content.substring(0, match.index).split('\n').length;
      headings.push({ level, text, line });
    }

    items.value = headings;
  };

  const jumpToHeading = (line: number, setEditorCursor: (line: number, ch: number) => void, focusEditor: () => void) => {
    setEditorCursor(line - 1, 0);
    focusEditor();
  };

  const getIndentClass = (level: number) => {
    return `h${level}`;
  };

  return {
    items,
    updateTOC,
    jumpToHeading,
    getIndentClass
  };
}
