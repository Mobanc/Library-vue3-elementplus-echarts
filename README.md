# 图书管理系统

这是一个基于 Vue 3 和 Vite 构建的项目，项目使用了element-plus以及echarts来进行开发，用户可以通过自行修改来自定义按钮功能以及接入后端。（小白级别项目）

## 项目预览

![preview-one](https://github.com/Mobanc/Library-vue3-elementplus-echarts/blob/main/src/assets/preview-one.gif)

![preview-two](https://github.com/Mobanc/Library-vue3-elementplus-echarts/blob/main/src/assets/preview-two.gif)

## 如何开始

以下是在本地启动该项目的步骤。

### 环境要求（开发使用环境）

- [Node.js](https://nodejs.org/) (v20.2.0)
- npm  (9.6.6)
- 或 pnpm (8.7.4)

### 依赖安装

首先，你需要安装项目所需的依赖。

```
npm install 
```

或

```
pnpm install 
```

或使用VSCode打开右键窗口左侧空白处 -> 在集成终端中打开，然后在输入以上两条指令中的一种（前提是您已安装了）。

### 本地开发（运行项目）

运行以下命令启动本地开发服务器：

```
# 切换到到项目路径中，如cd D:\my_vue_pro\vue3-pra-pro\tsgl-vue3-ele\tsgl-vue3
npm run dev
```

或

1. 使用VSCode打开这个项目
2. 找到package.json
3. 点击调试

![preview-three](https://github.com/Mobanc/Library-vue3-elementplus-echarts/blob/main/src/assets/preview-three.png)

4. 点击dev

![preview-four](https://github.com/Mobanc/Library-vue3-elementplus-echarts/blob/main/src/assets/preview-four.png)

默认情况下，你可以在浏览器中访问 [http://localhost:3000](http://localhost:3000/) 查看项目。

### 构建项目

如果你需要构建项目以部署到生产环境，运行以下命令：

```
npm run build
```

构建后的文件将存储在 `dist` 目录下。

## 项目结构

- `src/`: 存放项目源码
- `src/assets/`images: 存放静态资源
- `src/components/`: 存放组件（部分网页）
- `src/router/`: 存放路由配置

## 相关链接

- [Vue](https://v3.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Element-Plus](https://element-plus.org/)
- [Apache ECharts](https://echarts.apache.org/)

## 许可证

本项目基于 [MIT 许可证](https://chat.openai.com/c/LICENSE)。
