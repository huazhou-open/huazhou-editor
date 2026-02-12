# 知晓笔记 (Zhixiao Note)

一个基于 Electron + Vue3 + Element Plus + TypeScript 的桌面笔记应用。

## 技术栈

- **Electron** - 跨平台桌面应用框架
- **Vue 3** - 渐进式 JavaScript 框架
- **Element Plus** - Vue 3 UI 组件库
- **TypeScript** - JavaScript 的超集
- **SCSS** - CSS 预处理器
- **Vite** - 下一代前端构建工具

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

## 构建

### 构建项目

```bash
npm run build
```

### 平台特定构建

```bash
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

构建产物将输出到 `release` 目录。

## 项目结构

```
zhixiao-note/
├── electron/           # Electron 主进程
├── preload/            # 预加载脚本
├── src/
│   ├── styles/         # 全局样式
│   ├── types/          # 类型定义
│   ├── assets/         # 静态资源
│   ├── components/     # Vue 组件
│   ├── App.vue         # 根组件
│   └── main.ts         # Vue 应用入口
├── index.html         # HTML 入口
├── package.json       # 项目配置
├── tsconfig.json      # TypeScript 配置
└── electron.vite.config.ts  # 构建配置
```
