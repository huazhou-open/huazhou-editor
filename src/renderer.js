// Initialize CodeMirror editor
const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    mode: 'markdown',
    lineNumbers: true,
    lineWrapping: true,
    theme: null,
    autofocus: true,
    tabSize: 4
});

// Debug: Check marked object
console.log('marked:', typeof marked);
console.log('marked keys:', Object.keys(marked || {}));
console.log('CodeMirror:', typeof CodeMirror);

// Application state
let currentTheme = 'light';
let syncScroll = true;
let isUnsaved = false;

// DOM elements
const previewContent = document.getElementById('preview-content');
const wordCount = document.getElementById('word-count');
const lineCount = document.getElementById('line-count');
const charCount = document.getElementById('char-count');
const tocSidebar = document.getElementById('toc-sidebar');
const tocContent = document.getElementById('toc-content');
const previewContainer = document.querySelector('.preview-container');

console.log('DOM elements:', { previewContent, wordCount, lineCount, charCount });

// Update preview
function updatePreview() {
    const markdown = editor.getValue();

    let html = '';
    try {
        // marked v12+ - try both methods
        if (typeof marked === 'function') {
            html = marked(markdown);
        } else if (marked && typeof marked.parse === 'function') {
            html = marked.parse(markdown);
        } else if (marked && typeof marked.marked === 'function') {
            html = marked.marked(markdown);
        } else {
            html = markdown; // fallback: show raw text
        }
    } catch (e) {
        console.error('Error parsing markdown:', e);
        html = `<p>Error: ${e.message}</p>`;
    }

    previewContent.innerHTML = html;
}

// Update statistics
function updateStats() {
    const content = editor.getValue();
    const lines = editor.lineCount();

    const chars = content.length;
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;

    wordCount.textContent = `${words} 字`;
    wordCount.title = '字数统计';
    lineCount.textContent = `${lines} 行`;
    lineCount.title = '行数统计';
    charCount.textContent = `${chars} 字符`;
    charCount.title = '字符统计';
}

// Update Table of Contents
function updateTOC() {
    const content = editor.getValue();
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2];
        const line = content.substring(0, match.index).split('\n').length;
        headings.push({ level, text, line });
    }

    tocContent.innerHTML = '';

    headings.forEach((heading) => {
        const item = document.createElement('div');
        item.className = `toc-item h${heading.level}`;
        item.textContent = heading.text;
        item.title = heading.text;
        item.dataset.line = heading.line;
        item.onclick = () => {
            editor.setCursor(heading.line - 1, 0);
            editor.focus();
        };
        tocContent.appendChild(item);
    });
}

// Editor change handler
editor.on('change', (cm, changeObj) => {
    console.log('Editor changed:', changeObj);
    updatePreview();
    updateStats();
    updateTOC();

    if (!isUnsaved) {
        isUnsaved = true;
        window.electronAPI.sendEditorChanged();
    }
});

// Sync scroll handler
editor.on('scroll', () => {
    if (syncScroll) {
        const scrollInfo = editor.getScrollInfo();
        const scrollRatio = scrollInfo.top / (scrollInfo.height - scrollInfo.clientHeight);
        const previewHeight = previewContainer.scrollHeight - previewContainer.clientHeight;
        previewContainer.scrollTop = scrollRatio * previewHeight;
    }
});

// Toolbar button handlers
document.querySelectorAll('.toolbar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        handleToolbarAction(action);
    });
});

function handleToolbarAction(action) {
    switch (action) {
        case 'new':
            editor.setValue('');
            isUnsaved = false;
            break;
        case 'open':
            // Handled by main process
            break;
        case 'save':
            // Handled by main process
            break;
        case 'undo':
            editor.execCommand('undo');
            break;
        case 'redo':
            editor.execCommand('redo');
            break;
        case 'bold':
            wrapSelection('**', '**');
            break;
        case 'italic':
            wrapSelection('*', '*');
            break;
        case 'strikethrough':
            wrapSelection('~~', '~~');
            break;
        case 'h1':
            insertHeading(1);
            break;
        case 'h2':
            insertHeading(2);
            break;
        case 'h3':
            insertHeading(3);
            break;
        case 'code':
            insertCodeBlock();
            break;
        case 'quote':
            insertQuote();
            break;
        case 'list':
            insertList();
            break;
        case 'link':
            insertLink();
            break;
        case 'image':
            insertImage();
            break;
        case 'table':
            insertTable();
            break;
        case 'hr':
            insertHorizontalRule();
            break;
        case 'find':
            editor.execCommand('find');
            break;
        case 'theme':
            toggleTheme();
            break;
        case 'sync':
            toggleSync();
            break;
    }
}

function wrapSelection(before, after) {
    const selection = editor.somethingSelected()
        ? editor.getSelection()
        : '';

    editor.replaceSelection(`${before}${selection}${after}`);

    if (selection.length === 0) {
        const cursor = editor.getCursor();
        editor.setCursor(cursor.line, cursor.ch - after.length);
    }
}

function insertHeading(level) {
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
}

function insertCodeBlock() {
    const selection = editor.somethingSelected()
        ? editor.getSelection()
        : '';

    if (selection.includes('\n')) {
        editor.replaceSelection(`\`\`\`\n${selection}\n\`\`\`\n`);
    } else {
        editor.replaceSelection(`\`${selection}\` `);
    }
    editor.focus();
}

function insertQuote() {
    const cursor = editor.getCursor();
    editor.replaceRange('> ', cursor);
    editor.focus();
}

function insertList() {
    const cursor = editor.getCursor();
    const line = editor.getLine(cursor.line);

    if (line.match(/^\d+\./)) {
        // Handle numbered list increment
        const num = parseInt(line.match(/^\d+/)[0]);
        editor.replaceRange(`${num + 1}. `, { line: cursor.line, ch: 0 });
    } else {
        editor.replaceRange('- ', cursor);
    }
    editor.focus();
}

function insertLink() {
    const selection = editor.somethingSelected()
        ? editor.getSelection()
        : '链接文本';

    editor.replaceSelection(`[${selection}](url)`);
    editor.focus();
}

function insertImage() {
    const selection = editor.somethingSelected()
        ? editor.getSelection()
        : '图片描述';

    editor.replaceSelection(`![${selection}](url)`);
    editor.focus();
}

function insertTable() {
    const table = `| 表头1 | 表头2 | 表头3 |
|-------|-------|-------|
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |
`;
    editor.replaceSelection(table);
    editor.focus();
}

function insertHorizontalRule() {
    editor.replaceSelection('\n---\n');
    editor.focus();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.body.classList.toggle('dark-theme', currentTheme === 'dark');
    document.body.classList.toggle('light-theme', currentTheme === 'light');

    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.classList.toggle('active', currentTheme === 'dark');

    editor.setOption('theme', currentTheme === 'dark' ? 'dracula' : 'default');
}

function toggleSync() {
    syncScroll = !syncScroll;
    const syncBtn = document.getElementById('sync-toggle');
    syncBtn.classList.toggle('active', syncScroll);
}

// IPC handlers
window.electronAPI.onFileNew((_) => {
    editor.setValue('');
    isUnsaved = false;
});

window.electronAPI.onFileOpen((_, { content }) => {
    editor.setValue(content);
    isUnsaved = false;
    updatePreview();
    updateStats();
    updateTOC();
});

window.electronAPI.onFileSaved((_, data) => {
    isUnsaved = false;
    if (data && data.filePath) {
        // File saved with new path
    }
});

window.electronAPI.onEditorFind((_) => {
    editor.execCommand('find');
});

window.electronAPI.onEditorReplace((_) => {
    editor.execCommand('replace');
});

window.electronAPI.onEditorZoom((_, { level }) => {
    const currentFontSize = parseFloat(getComputedStyle(document.body).fontSize);
    const newSize = level === 0 ? 14 : currentFontSize + level;
    editor.getWrapperElement().style.fontSize = `${newSize}px`;
    editor.refresh();
});

// Format: Bold
window.electronAPI.onFormatBold((_) => wrapSelection('**', '**'));

// Format: Italic
window.electronAPI.onFormatItalic((_) => wrapSelection('*', '*'));

// Format: Strikethrough
window.electronAPI.onFormatStrikethrough((_) => wrapSelection('~~', '~~'));

// Format: Heading
window.electronAPI.onFormatHeading((_, { level }) => insertHeading(level));

// Format: Code
window.electronAPI.onFormatCode((_) => insertCodeBlock());

// Format: Quote
window.electronAPI.onFormatQuote((_) => insertQuote());

// Format: List
window.electronAPI.onFormatList((_) => insertList());

// Format: Link
window.electronAPI.onFormatLink((_) => insertLink());

// Format: Image
window.electronAPI.onFormatImage((_) => insertImage());

// Format: Table
window.electronAPI.onFormatTable((_) => insertTable());

// Format: Horizontal Rule
window.electronAPI.onFormatHr((_) => insertHorizontalRule());

// Get editor content handler
window.electronAPI.onGetEditorContent((_) => {
    window.electronAPI.sendEditorContent(editor.getValue());
});

// TOC close button
document.getElementById('toc-close').addEventListener('click', () => {
    tocSidebar.classList.remove('open');
});

// Show TOC on double-click in editor
editor.on('dblclick', () => {
    tocSidebar.classList.add('open');
});

// Focus editor on load
editor.focus();
