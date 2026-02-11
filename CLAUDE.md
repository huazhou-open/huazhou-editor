# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供项目指南。

## 项目概述

花洲 Markdown 编辑器是基于 Electron + Vue 3 + TypeScript 构建的桌面 Markdown 编辑器。

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式（带开发者工具）
npm run dev

# 生产构建并运行
npm run compile && electron .

# 仅编译主进程/预加载脚本（修改后端代码时更快）
npm run compile:main

# 监听渲染进程变更（Vite 开发服务器）
npm run dev:renderer

# 打包发布
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## 架构设计

项目采用 Electron 多进程架构：

### 主进程 (`src/main.ts`)
- 创建 BrowserWindow 并管理应用生命周期
- 处理原生文件对话框和菜单操作
- 管理文件夹导航的文件树构建
- IPC 处理器与渲染进程通信
- 跟踪当前文件路径和未保存状态

### 预加载脚本 (`src/preload.ts`)
- 使用 `contextBridge` 桥接主进程和渲染进程
- 通过 `window.electronAPI` 暴露安全的 IPC 通信接口
- 定义所有 IPC 通道的 TypeScript 接口

### 渲染进程 (`src/renderer/`)
- **Vue 3 Composition API**，使用 `<script setup>` 语法
- **组件**：Toolbar、EditorPanel、PreviewPanel、FileTreeSidebar、TableOfContents、StatusBar
- **Composables**：可复用逻辑模块
  - `useEditor` - CodeMirror 封装及 TypeScript 接口
  - `useMarkdown` - Markdown 解析工具
  - `useTheme` - 深色/浅色主题管理
  - `useFormat` - 文本格式化命令
  - `useFileTree` - 文件树导航
  - `useTableOfContents` - 标题提取

### 构建系统
- **多 tsconfig 配置**：
  - `tsconfig.json` - 基础配置
  - `tsconfig.main.json` - 主进程 (CommonJS)
  - `tsconfig.preload.json` - 预加载脚本
- **Vite** 构建渲染进程（输出到 `dist/`）
- **TypeScript 编译器** 构建主进程/预加载脚本（输出到 `dist/`）
- 所有编译后的文件统一放在 `dist/` 目录

### IPC 通信模式
- 主进程 → 渲染进程：`mainWindow.webContents.send(event, data)`
- 渲染进程 → 主进程：通过 `window.electronAPI` 调用 `ipcRenderer.send(event, data)`
- 渲染进程监听：`window.electronAPI.onEvent(callback)`
- 组件间通信：通过 `window.dispatchEvent(new CustomEvent(...))`

## 核心依赖
- **CodeMirror 5** - 支持 Markdown 模式的编辑器（通过 ES Module 导入，Vite 打包）
- **Marked** - Markdown 转 HTML 解析器（通过 ES Module 导入，Vite 打包）
- **Vue 3** - 渲染进程 UI 框架

所有依赖（CodeMirror、Marked、Vue）均通过 Vite 打包成单个 JS 文件，无需在 HTML 中手动引入。

## 文件位置
- 源码：`src/`
- 编译输出：`dist/`（所有构建文件统一输出到此目录）
- 入口 HTML：`src/index.html`（构建时复制到 `dist/index.html`）
