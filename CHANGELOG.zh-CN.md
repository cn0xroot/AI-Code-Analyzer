# 更新日志

本项目所有重要变更都记录在此。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循[语义化版本](https://semver.org/lang/zh-CN/)。

**语言：** [English](CHANGELOG.md) | [中文](CHANGELOG.zh-CN.md)

## [1.1.0] - 2026-09-20

### 新增
- **中英文双语界面**（基于 vue-i18n）：侧边栏语言切换，Element Plus 组件语言随界面切换，偏好自动记忆，URL 参数 `?lang=en` / `?lang=zh` 可强制指定，默认跟随浏览器语言。
- **AI 输出语言**：分析页与"重新分析"对话框新增"输出语言"选项，提示词提供中英两套模板。任务语言会持久化（`analysis_tasks.language`，启动时自动补列），AI 对话按当前界面语言回答。
- **模型配置编辑**：模型卡片新增"编辑"按钮。API Key 留空则保持原 Key 不变；提供商与模型 ID 现在也可修改（`PUT /api/v1/models/{id}`）。
- **拉取可用模型列表**：新增 `POST /api/v1/models/available`，从提供商获取模型 ID（OpenAI / 通义千问 / OpenAI 兼容中转站走 `GET /models`，Anthropic 走官方 SDK）。"模型 ID"改为可搜索下拉框并配"拉取模型列表"按钮，保存前即可校验 Key 与 Base URL 是否正确。
- 英文 `README.md` 作为默认 README，中文版移至 `README.zh-CN.md`；新增"环境要求与依赖"章节，列出全部系统要求与依赖包。
- `.gitignore`：忽略 `node_modules`、构建产物、Python 缓存、虚拟环境、SQLite 数据库、上传与克隆目录。
- 新增 `httpx[socks]` 依赖，设置了 `all_proxy=socks5://…` 时 AI SDK 请求也能正常工作。

### 变更
- **Web UI 重新设计**（源自 Claude Design 画布）：240px 侧边栏工作台布局替代顶部导航；新设计令牌（冷灰蓝底 + 薄荷绿强调色）、Space Grotesk / IBM Plex Sans / IBM Plex Mono 字体、内联 SVG 图标集。7 套主题保留为配色变体。
  - 首页：Hero + 内嵌仓库地址输入、特性卡片、最近分析列表。
  - 分析页：分段式来源切换、平台胶囊按钮、带说明的分析类型卡片、输出语言开关。
  - 结果页：进行中为步骤条 + 实时流式面板 + 任务卡；完成后为章节导航、正文/图表卡片与固定的 AI 对话栏。
  - 历史页：搜索与状态/类型筛选、状态标签、行内操作。
  - 模型页：卡片网格、"设为默认"、添加/编辑对话框中的提供商卡片式选择。
- AI 响应仅按提示词约定的章节标题切分，模型在正文中添加的 `###` 小标题不再被拆成成百上千个章节。
- 系统提示词中的 Mermaid 语法规则改为英文（请求中文输出时标签仍可为中文）。
- API 响应中的时间戳序列化为 UTC（带 `Z`），浏览器在任何时区都能正确显示本地时间，"已用时"计时正常。
- 前端构建产物（`frontend/dist`）与 `node_modules` 移出版本控制，并重写了仓库历史以彻底清除。

### 修复
- OpenAI 兼容 Base URL 不带路径（如 `https://relay.example.com`）时会请求到中转站网页而非 API，空响应被当作成功，导致分析"已完成"却没有任何结果、对话没有回复。现在 Base URL 自动补全 `/v1`，模型返回空内容时任务会以明确错误失败。
- 分析详情接口未返回任务语言，英文任务在界面上被标为"中文"。
- 英文界面下历史页操作列与语言列重叠。

## [1.0.0] - 2026-05-10

### 新增
- 首个版本：GitHub / GitLab / Gitee 仓库克隆（含实时进度）、本地上传、tree-sitter 解析 10 种语言、流式 AI 分析（OpenAI、Anthropic、通义千问、OpenAI 兼容接口）、Mermaid 图表渲染、分析历史与 7 套界面主题。

[1.1.0]: https://github.com/cn0xroot/AI-Code-Analyzer/compare/d1fc3c1...v1.1.0
[1.0.0]: https://github.com/cn0xroot/AI-Code-Analyzer/commits/d1fc3c1
