# AI-Code-Analyzer
基于 AI 大模型的代码分析系统，自动生成项目功能概述、技术栈分析、架构设计、实现原理，并输出 Mermaid 可视化图表（架构图、流程图、类图、时序图等）。支持实时流式 AI 输出与 Markdown 预览。

## 功能特性

- **多平台代码获取**: GitHub、GitLab、Gitee 在线仓库克隆（支持实时进度、网速显示），本地代码上传（文件/zip）
- **多语言解析**: Python、Java、JavaScript、TypeScript、Go、PHP、C#、C/C++、Swift、Kotlin（基于 tree-sitter AST 解析）
- **多 AI 模型**: OpenAI、Anthropic (Claude)、通义千问、OpenAI 兼容中转站
- **多维度深度分析**:
  - **项目概览** — 项目功能、技术栈、架构设计、实现原理 + 架构图/业务流程图/依赖图/技术栈图
  - **功能分析** — 文件功能、类与函数分析、设计模式 + 类图/调用关系图
  - **逻辑流程** — 执行逻辑、关键实现细节 + 逻辑流程图/时序图
  - **全量分析** — 以上全部
- **实时 AI 输出**: SSE 流式推送 AI 生成内容，Markdown 实时渲染预览，Mermaid 图表自动渲染
- **多主题配色**: 7 套主题（暗夜/海洋/森林/暮色/玫瑰/Nord/浅色），源自 AI_Web_Search 项目
- **分析历史**: SQLite 持久化存储，支持查看结果、重新分析、删除记录
- **容错机制**: 任务超时检测、服务器重启自动恢复僵尸任务、轮询失败重试

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Python 3 + FastAPI + SQLAlchemy + SQLite |
| 前端 | Vue 3 + Vite + Element Plus + Pinia |
| 代码解析 | tree-sitter + tree-sitter-language-pack (305+ 语言) |
| AI 集成 | OpenAI SDK + Anthropic SDK（流式输出） |
| 图表渲染 | Mermaid.js + marked (Markdown) + highlight.js |
| 实时通信 | SSE (Server-Sent Events) |

## 快速开始

### 1. 安装后端依赖

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，如需代理访问 GitHub：

```env
GIT_PROXY=http://127.0.0.1:7897
```

### 3. 启动后端

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000 \
  --reload-exclude "cloned_repos/*" \
  --reload-exclude "uploads/*" \
  --reload-exclude "*.db"
```

> 注意：必须使用 `--reload-exclude` 排除克隆目录，否则克隆代码会触发服务器重启导致分析任务中断。

后端启动后可访问：
- API 文档: http://localhost:8000/docs
- 生产前端 (需先构建): http://localhost:8000

### 4. 安装并启动前端

```bash
cd frontend
npm install
npm run dev
```

前端开发服务器运行在 http://localhost:3000，自动代理 `/api` 请求到后端。

### 5. 构建生产前端（可选）

```bash
cd frontend
./node_modules/.bin/vite build
```

构建后可直接通过后端 http://localhost:8000 访问完整应用。

### 6. 使用流程

1. 打开浏览器访问 http://localhost:3000（开发）或 http://localhost:8000（生产）
2. 进入「模型配置」页面，添加 AI 模型（填写 API Key、选择提供商和模型 ID）
3. 进入「代码分析」页面，输入 Git 仓库 URL 或上传本地代码
4. 选择 AI 模型和分析类型，点击「开始分析」
5. 实时查看 AI 输出的 Markdown 分析内容和 Mermaid 图表
6. 分析完成后查看结构化结果，支持导出 SVG

## 项目结构

```
Code_AI_ant/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI 入口 + SPA 静态文件服务 + 僵尸任务清理
│   │   ├── config.py               # 配置管理 (含 GIT_PROXY)
│   │   ├── database.py             # SQLite 引擎和会话
│   │   ├── api/endpoints/
│   │   │   ├── analysis.py         # 分析任务 + SSE 流式输出 + 超时检测
│   │   │   ├── repos.py            # 仓库克隆 (SSE 进度) / 上传
│   │   │   ├── models_config.py    # AI 模型配置 CRUD
│   │   │   └── history.py          # 分析历史
│   │   ├── models/                 # ORM 模型 (Project, AnalysisTask, AIModelConfig)
│   │   ├── schemas/                # Pydantic 请求/响应模型
│   │   ├── services/
│   │   │   ├── analysis_service.py # 分析编排 + 流式 AI 调用 + 内存进度
│   │   │   ├── code_fetcher.py     # Git 克隆 (代理/进度/网速) + 文件上传
│   │   │   ├── code_parser.py      # tree-sitter 多语言 AST 解析
│   │   │   ├── ai_analyzer.py      # AI Provider 工厂 (含流式)
│   │   │   ├── mermaid_generator.py# AI 响应 Mermaid 解析
│   │   │   └── providers/          # OpenAI / Anthropic / 通义 / 中转站
│   │   └── prompts/                # AI 提示词模板 (概览/功能/逻辑流程)
│   ├── requirements.txt
│   ├── .env.example
│   └── .env                        # 本地配置 (不入版本控制)
├── frontend/
│   ├── src/
│   │   ├── views/
│   │   │   ├── HomePage.vue        # 首页
│   │   │   ├── AnalysisConfig.vue  # 分析配置 (克隆/上传 + 模型选择)
│   │   │   ├── AnalysisResult.vue  # 结果页 (实时 Markdown 预览 + Mermaid)
│   │   │   ├── HistoryPage.vue     # 历史记录 (含重新分析)
│   │   │   └── SettingsPage.vue    # AI 模型配置
│   │   ├── components/
│   │   │   ├── AppHeader.vue       # 导航 + 7 主题切换
│   │   │   ├── MermaidDiagram.vue  # Mermaid 图表渲染
│   │   │   ├── RepoInput.vue       # 仓库克隆 (SSE 实时进度/网速)
│   │   │   ├── FileUploader.vue    # 文件上传
│   │   │   ├── ModelSelector.vue   # AI 模型选择器
│   │   │   ├── AnalysisProgress.vue# 分析进度 (步骤条)
│   │   │   ├── DiagramTabs.vue     # 结果标签页
│   │   │   └── CodeViewer.vue      # 代码高亮
│   │   ├── api/                    # Axios + fetch API 封装
│   │   ├── stores/                 # Pinia 状态管理 (含 sessionStorage 持久化)
│   │   ├── router/                 # Vue Router
│   │   └── styles/main.css         # 7 套主题 CSS 变量 + Element Plus 覆写
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/v1/repos/clone | 克隆远程 Git 仓库 |
| POST | /api/v1/repos/clone/stream | 克隆仓库 (SSE 实时进度/网速) |
| POST | /api/v1/repos/upload | 上传本地代码文件 |
| POST | /api/v1/analysis/ | 创建分析任务 (后台执行) |
| GET | /api/v1/analysis/{id} | 获取完整分析结果 |
| GET | /api/v1/analysis/{id}/status | 查询任务状态 |
| GET | /api/v1/analysis/{id}/stream | SSE 流式 AI 输出 |
| GET | /api/v1/models/ | 列出 AI 模型配置 |
| POST | /api/v1/models/ | 添加 AI 模型配置 |
| PUT | /api/v1/models/{id} | 更新 AI 模型配置 |
| DELETE | /api/v1/models/{id} | 删除 AI 模型配置 |
| GET | /api/v1/history/ | 分析历史（分页） |
| DELETE | /api/v1/history/{id} | 删除历史记录 |

## 配置说明

后端配置通过 `.env` 文件管理，参考 `backend/.env.example`：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| DATABASE_URL | 数据库连接 | sqlite:///./code_analyzer.db |
| UPLOAD_DIR | 上传文件目录 | ./uploads |
| CLONE_DIR | 克隆仓库目录 | ./cloned_repos |
| MAX_UPLOAD_SIZE_MB | 最大上传大小 | 50 |
| MAX_FILE_SIZE_KB | 单文件解析上限 | 500 |
| GIT_PROXY | Git 代理地址 | 无 (直连) |

## 支持的 AI 提供商

| 提供商 | provider 值 | 说明 |
|--------|-------------|------|
| OpenAI | openai | GPT-4o 等模型，支持流式输出 |
| Anthropic | anthropic | Claude 系列模型，支持流式输出 |
| 通义千问 | tongyi | 阿里云 DashScope OpenAI 兼容 API |
| OpenAI 兼容 | openai_compat | 中转站/第三方兼容接口，需填写 Base URL |

## 主题配色

支持 7 套主题，通过右上角主题按钮切换：

| 主题 | 名称 | 风格 | 主色调 |
|------|------|------|--------|
| midnight | 暗夜 | 深色 | 靛蓝 #6366f1 |
| ocean | 海洋 | 深色 | 青蓝 #0ea5e9 |
| forest | 森林 | 深色 | 翠绿 #22c55e |
| sunset | 暮色 | 深色 | 橙色 #f97316 |
| rose | 玫瑰 | 深色 | 粉红 #ec4899 |
| nord | Nord | 深色 | 冰蓝 #88c0d0 |
| light | 浅色 | 亮色 | 靛蓝 #6366f1 |

## 分析维度说明

### 项目概览
- 项目功能概述（做什么、解决什么问题、核心功能）
- 技术栈分析（前端/后端/数据库/工具链分类）
- 架构设计（架构模式、模块职责、协作方式）
- 实现原理与核心流程（数据流转、关键算法）
- 输出图表：架构图、核心业务流程图、模块依赖图、技术栈组成图

### 功能分析
- 文件功能说明与角色定位
- 类与函数逐一分析
- 设计模式识别
- 输出图表：类图、函数调用关系图

### 逻辑流程
- 执行逻辑逐步描述
- 关键实现细节与边界情况
- 输出图表：逻辑流程图、时序图
