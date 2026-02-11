# 花洲 Markdown 编辑器

一个现代化的 Markdown 桌面编辑器，基于 Electron 技术框架构建。

## 功能特性

### 核心功能
- **实时编辑与预览** - 左右分屏布局，实时预览 Markdown 渲染效果
- **语法高亮** - 基于 CodeMirror 的完整 Markdown 语法高亮
- **多代码块支持** - 支持 JavaScript、Python、Ruby、PHP、CSS、XML 等多种语言代码高亮
- **自动保存提示** - 文件修改后自动提示保存，防止数据丢失

### 格式工具
- **文本格式** - 粗体、斜体、删除线
- **标题级别** - H1-H6 标题快速插入
- **代码支持** - 行内代码和代码块
- **引用与列表** - 引用块、无序/有序列表
- **链接与图片** - 快速插入链接和图片
- **表格与分隔线** - 表格模板和水平分隔线

### 编辑器增强
- **实时统计** - 字数、行数、字符数实时显示
- **目录导航** - 自动提取标题生成目录，点击跳转
- **查找替换** - 强大的查找和替换功能
- **撤销重做** - 完整的历史记录支持

### 视觉体验
- **主题切换** - 亮色/暗色主题一键切换
- **同步滚动** - 编辑器和预览区域同步滚动
- **响应式设计** - 适配不同窗口大小

### 文件操作
- **新建/打开/保存** - 完整的文件操作支持
- **另存为** - 支持多种格式保存
- **快捷键支持** - 常用操作快捷键

## 快捷键

| 操作 | Windows/Linux | macOS |
|------|----------------|-------|
| 新建 | Ctrl+N | Cmd+N |
| 打开 | Ctrl+O | Cmd+O |
| 保存 | Ctrl+S | Cmd+S |
| 另存为 | Ctrl+Shift+S | Cmd+Shift+S |
| 撤销 | Ctrl+Z | Cmd+Z |
| 重做 | Ctrl+Y | Cmd+Y |
| 查找 | Ctrl+F |与其他 Cmd+F |
| 替换 | Ctrl+H | Cmd+H |
| 粗体 | Ctrl+B | Cmd+B |
| 斜体 | Ctrl+I | Cmd+I |
| 全选 | Ctrl+A | Cmd+A |
| 全屏 | F11 | F11 |

## 安装与运行

### 开发环境运行

1. 克隆或下载项目到本地

2. 安装依赖
```bash
npm install
```

3. 启动应用
```bash
npm start
```

或以开发模式启动（包含开发者工具）：
```bash
npm run dev
```

### 打包应用

#### Windows
```bash
npm run build:win
```

#### macOS
```bash
npm run build:mac
```

#### Linux
```bash
npm run build:linux
```

打包后的输出文件位于 `dist` 目录。

## 项目结构

```
huazhou-editor/
├── src/
│   ├── main.js          # Electron 主进程
│   ├── preload.js       # 预加载脚本（IPC通信桥接）
│   ├── index.html       # 渲染进程主页面
│   ├── renderer.js      # 渲染进程逻辑
│   └── editor.css       # 编辑器样式
├── resources/           # 应用资源（图标等）
├── package.json         # 项目配置
└── README.md           # 项目说明
```

## 技术栈

- **Electron** - 跨平台桌面应用框架
- **CodeMirror** - 代码编辑器组件
- **Marked** - Markdown 解析和渲染库

## 开发计划

### 已完成
- [x] Electron 项目初始化
- [x] 主进程与渲染进程通信
- [x] Markdown 编辑器集成
- [x] 实时预览功能
- [x] 文件读写操作
- [x] 快捷键支持
- [x] 主题切换
- [x] 统计功能
- [x] 目录导航

### 未来扩展
- [ ] 导出为 HTML/PDF
- [ ] 自定义主题支持
- [ ] 数学公式支持（KaTeX）
- [ ] 脚注支持
- [ ] 拼写检查
- [ ] 图片拖拽上传
- [ ] 云存储同步
- [ ] 插件系统

## 许可证

MIT License

## 作者

花洲科技
