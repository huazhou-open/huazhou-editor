export function useFormat() {
  interface EditorMethods {
    getValue: () => string;
    getCursor: () => { line: number; ch: number };
    setCursor: (line: number, ch: number) => void;
    getSelection: () => string;
    replaceSelection: (text: string) => void;
    replaceRange: (text: string, from: { line: number; ch: number }, to?: { line: number; ch: number }) => void;
    getLine: (line: number) => string;
    somethingSelected: () => boolean;
    focus: () => void;
  }

  const wrapSelection = (editor: EditorMethods, before: string, after: string) => {
    const selection = editor.somethingSelected()
      ? editor.getSelection()
      : '';

    editor.replaceSelection(`${before}${selection}${after}`);

    if (selection.length === 0) {
      const cursor = editor.getCursor();
      editor.setCursor(cursor.line, cursor.ch - after.length);
    }
  };

  const insertHeading = (editor: EditorMethods, level: number) => {
    const hash = '#'.repeat(level);
    const cursor = editor.getCursor();
    const line = editor.getLine(cursor.line);

    if (line.match(/^#+\s/)) {
      const newLine = line.replace(/^#+\s/, `${hash} `);
      editor.replaceRange(newLine, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
    } else {
      editor.replaceRange(`${hash} `, { line: cursor.line, ch: 0 });
    }

    editor.focus();
  };

  const insertCodeBlock = (editor: EditorMethods) => {
    const selection = editor.somethingSelected()
      ? editor.getSelection()
      : '';

    if (selection.includes('\n')) {
      editor.replaceSelection(`\`\`\`\n${selection}\n\`\`\`\n`);
    } else {
      editor.replaceSelection(`\`${selection}\` `);
    }
    editor.focus();
  };

  const insertQuote = (editor: EditorMethods) => {
    const cursor = editor.getCursor();
    editor.replaceRange('> ', cursor);
    editor.focus();
  };

  const insertList = (editor: EditorMethods) => {
    const cursor = editor.getCursor();
    const line = editor.getLine(cursor.line);

    if (line.match(/^\d+\./)) {
      const num = parseInt(line.match(/^\d+/)![0]);
      editor.replaceRange(`${num + 1}. `, { line: cursor.line, ch: 0 });
    } else {
      editor.replaceRange('- ', cursor);
    }
    editor.focus();
  };

  const insertLink = (editor: EditorMethods) => {
    const selection = editor.somethingSelected()
      ? editor.getSelection()
      : '链接文本';

    editor.replaceSelection(`[${selection}](url)`);
    editor.focus();
  };

  const insertImage = (editor: EditorMethods) => {
    const selection = editor.somethingSelected()
      ? editor.getSelection()
      : '图片描述';

    editor.replaceSelection(`![${selection}](url)`);
    editor.focus();
  };

  const insertTable = (editor: EditorMethods) => {
    const table = `| 表头1 | 表头2 | 表头3 |
|-------|-------|-------|
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |
`;
    editor.replaceSelection(table);
    editor.focus();
  };

  const insertHorizontalRule = (editor: EditorMethods) => {
    editor.replaceSelection('\n---\n');
    editor.focus();
  };

  return {
    wrapSelection,
    insertHeading,
    insertCodeBlock,
    insertQuote,
    insertList,
    insertLink,
    insertImage,
    insertTable,
    insertHorizontalRule
  };
}
