# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供在此代码库中工作的指导。

## 项目架构

**知晓笔记** - 基于 electron-vite 构建系统的 Electron 桌面笔记应用。架构遵循 Electron 多进程模式：

- **主进程** (`electron/index.ts`) - Node.js 环境，管理应用生命周期和窗口
- **预加载脚本** (`preload/index.ts`) - 主进程与渲染进程间的安全桥梁，通过 `contextBridge` 暴露受限 API
- **渲染进程** (`src/`) - Vue3 应用，运行在浏览器上下文中

进程间通信使用 IPC（进程间通信）。渲染进程通过 `window.electronAPI` 访问暴露的 API。

## 常用命令

```bash
# 开发模式（Linux 下需要 ELECTRON_DISABLE_SANDBOX=1）
npm run dev

# 生产构建
npm run build

# 平台特定构建
npm run build:win    # Windows NSIS 安装包
npm run build:mac    # macOS DMG
npm run build:linux  # Linux AppImage
```

## 目录结构

```
zhixiao-note/
├── electron/           # 主进程 (Node.js)
├── preload/            # 预加载脚本 (安全 IPC 桥接)
├── src/
│   ├── styles/         # 全局样式 (SCSS)
│   │   ├── variables.scss   # 样式变量（颜色、间距等）
│   │   ├── global.scss      # 全局样式和工具类
│   │   └── index.scss      # 样式入口文件
│   ├── types/           # TypeScript 类型定义
│   │   ├── index.d.ts       # 类型入口（统一导出）
│   │   ├── electron.d.ts    # Electron IPC API 类型
│   │   ├── components.d.ts  # Vue 组件类型（TableColumn、MenuItem 等）
│   │   └── global.d.ts     # 通用类型（ApiResponse、PageResponse 等）
│   ├── assets/         # 图片、视频、静态资源
│   ├── components/     # Vue 组件
│   │   └── [组件名称]/       # 组件目录包含其视图、类型等
│   ├── App.vue         # 根组件
│   ├── main.ts         # Vue 应用入口
│   └── vite-env.d.ts   # Vite 环境类型（保持在 src 根目录）
├── electron.vite.config.ts  # 构建配置
└── tsconfig.json       # TypeScript 配置
```

## 编码规范

### TypeScript
- **禁止使用 `any` 类型** - 使用明确的类型或 `unknown`（当类型确实未知时）
- 类型定义应组织在 `src/types/` 目录
- 组件私有类型放在 `src/components/[组件名]/types.ts`
- Electron IPC 类型放在 `src/types/electron.d.ts`，扩展 `Window` 接口
- `tsconfig.json` 中启用了严格模式

### 样式 (SCSS)
- 使用 `@use` 而非 `@import`（现代 Sass 语法）
- 样式变量定义在 `src/styles/variables.scss`
- 组件 `<style>` 块中使用 `lang="scss"`
- 示例：
  ```vue
  <style lang="scss" scoped>
  .my-class {
    color: $primary-color;
    padding: $spacing-md;
  }
  </style>
  ```

### 组件组织
`src/components/` 下的每个组件目录应包含：
- 组件 `.vue` 文件
- 类型定义 (`types.ts`)
- 相关的子组件或工具函数

### 导入规范
- 使用 `@/` 别名从 `src/` 目录导入
- 样式导入使用 `@/styles/...`
- 类型导入使用 `@/types/...`
- 示例：
  ```typescript
  import MyComponent from '@/components/MyComponent/MyComponent.vue'
  import type { MenuItem } from '@/types'
  import '@/styles/index.scss'
  ```

## Electron IPC 通信模式

添加新的 IPC 功能：

1. **类型** (`src/types/electron.d.ts`)：在 `ElectronAPI` 接口中添加类型定义
2. **预加载** (`preload/index.ts`)：通过 `contextBridge.exposeInMainWorld()` 暴露 API
3. **主进程** (`electron/index.ts`)：使用 `ipcMain.handle()` 或 `ipcMain.on()` 处理
4. **渲染进程**：通过 `window.electronAPI.yourMethod()` 访问

预加载暴露示例：
```typescript
contextBridge.exposeInMainWorld('electronAPI', {
  yourMethod: (arg: string) => ipcRenderer.invoke('your-channel', arg)
})
```

## 开发工作流

**每次修改完毕后必须执行以下检查：**

1. **检查依赖引入** - 确认所有新引入的模块/组件已正确导入
2. **运行应用验证** - 执行 `npm run dev` 启动开发模式，检查是否有报错
3. **构建验证** - 必要时执行 `npm run build` 验证生产构建无错误
