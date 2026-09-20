# AI Code Analyzer

An intelligent code analysis system powered by AI large language models that automatically generates project summaries, tech stack analysis, architecture design, implementation principles, and produces Mermaid visualizations (architecture diagrams, flowcharts, class diagrams, sequence diagrams, etc.). Supports real-time streaming AI output with Markdown preview.

**Languages:** [English](README.md) | [中文](README.zh-CN.md)

## Features

- **Multi-Platform Code Acquisition**: Clone from GitHub, GitLab, Gitee (with real-time progress and speed display), local code upload (files/zip)
- **Multi-Language Parsing**: Python, Java, JavaScript, TypeScript, Go, PHP, C#, C/C++, Swift, Kotlin (powered by tree-sitter AST parsing)
- **Multiple AI Providers**: OpenAI, Anthropic (Claude), Alibaba Qwen, OpenAI-compatible services
- **Multi-Dimensional Deep Analysis**:
  - **Project Overview** — Project purpose, tech stack, architecture design, implementation principles + architecture/business process/dependency/tech stack diagrams
  - **Function Analysis** — File functions, class & function analysis, design patterns + class/call relationship diagrams
  - **Logic Flow** — Execution logic, key implementation details + flow/sequence diagrams
  - **Full Analysis** — All of the above
- **Real-Time AI Streaming**: SSE streaming of AI-generated content with live Markdown rendering and automatic Mermaid diagram rendering
- **Multiple Themes**: 7 themes (Dark/Ocean/Forest/Sunset/Rose/Nord/Light) from AI_Web_Search project
- **Analysis History**: SQLite persistence with support for viewing results, re-analysis, and record deletion
- **Fault Tolerance**: Task timeout detection, automatic zombie task recovery on server restart, polling with retry

## Technology Stack

| Layer | Technologies |
|-------|--------------|
| Backend | Python 3 + FastAPI + SQLAlchemy + SQLite |
| Frontend | Vue 3 + Vite + Element Plus + Pinia |
| Code Parsing | tree-sitter + tree-sitter-language-pack (305+ languages) |
| AI Integration | OpenAI SDK + Anthropic SDK (streaming support) |
| Visualization | Mermaid.js + marked (Markdown) + highlight.js |
| Real-Time | SSE (Server-Sent Events) |

## Prerequisites & Dependencies

### System Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| Python | 3.10+ (tested on 3.13) | Backend runtime |
| Node.js | 18+ (tested on 22) | Frontend build & dev server |
| npm | 9+ | Frontend package manager |
| Git | 2.x | Cloning remote repositories |

### Backend Python Packages (`backend/requirements.txt`)

| Package | Purpose |
|---------|---------|
| fastapi | Web framework |
| uvicorn[standard] | ASGI server (with hot reload) |
| sqlalchemy | ORM / SQLite persistence |
| pydantic-settings | `.env` configuration loading |
| python-multipart | File upload support |
| gitpython | Git repository cloning |
| tree-sitter | AST parsing engine |
| tree-sitter-language-pack | Grammars for 305+ languages |
| openai | OpenAI / Qwen / OpenAI-compatible providers |
| anthropic | Anthropic (Claude) provider |
| python-dotenv | `.env` file support |
| httpx[socks] | SOCKS proxy support for AI SDK requests (required if `all_proxy=socks5://...` is set) |

Install all at once:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend npm Packages (`frontend/package.json`)

| Package | Purpose |
|---------|---------|
| vue | UI framework |
| vue-router | Client-side routing |
| pinia | State management |
| axios | HTTP client |
| element-plus | UI component library |
| mermaid | Diagram rendering |
| highlight.js | Code syntax highlighting |
| vite | Build tool & dev server (dev) |
| @vitejs/plugin-vue | Vue SFC support for Vite (dev) |

Install all at once:

```bash
cd frontend
npm install
```

## Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file. If you need a proxy for GitHub access:

```env
GIT_PROXY=http://127.0.0.1:7897
```

### 3. Start Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000 \
  --reload-exclude "cloned_repos/*" \
  --reload-exclude "uploads/*" \
  --reload-exclude "*.db"
```

> **Note**: You must use `--reload-exclude` to exclude cloned directories, otherwise cloned code will trigger server restart and interrupt analysis tasks.

After backend starts, you can access:
- API Documentation: http://localhost:8000/docs
- Frontend (after build): http://localhost:8000

### 4. Install and Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend dev server runs at http://localhost:3000 and automatically proxies `/api` requests to backend.

### 5. Build Production Frontend (Optional)

```bash
cd frontend
./node_modules/.bin/vite build
```

After building, access the complete application at http://localhost:8000.

### 6. Usage Workflow

1. Open browser and navigate to http://localhost:3000 (dev) or http://localhost:8000 (production)
2. Go to "Model Configuration" page and add AI models (fill API Key, select provider and model ID)
3. Go to "Code Analysis" page, enter Git repository URL or upload local code
4. Select AI model and analysis type, click "Start Analysis"
5. View real-time AI output with Markdown content and Mermaid diagrams
6. After completion, view structured results with SVG export support

## Project Structure

```
AI-Code-Analyzer/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI entry + SPA static files + zombie task cleanup
│   │   ├── config.py               # Configuration management (includes GIT_PROXY)
│   │   ├── database.py             # SQLite engine and session
│   │   ├── api/endpoints/
│   │   │   ├── analysis.py         # Analysis tasks + SSE streaming + timeout detection
│   │   │   ├── repos.py            # Repo cloning (SSE progress) / upload
│   │   │   ├── models_config.py    # AI model config CRUD
│   │   │   └── history.py          # Analysis history
│   │   ├── models/                 # ORM models (Project, AnalysisTask, AIModelConfig)
│   │   ├── schemas/                # Pydantic request/response models
│   │   ├── services/
│   │   │   ├── analysis_service.py # Analysis orchestration + streaming AI calls + memory progress
│   │   │   ├── code_fetcher.py     # Git cloning (proxy/progress/speed) + file upload
│   │   │   ├── code_parser.py      # tree-sitter multi-language AST parsing
│   │   │   ├── ai_analyzer.py      # AI Provider factory (streaming support)
│   │   │   ├── mermaid_generator.py# Mermaid parsing from AI responses
│   │   │   └── providers/          # OpenAI / Anthropic / Qwen / Compat providers
│   │   └── prompts/                # AI prompt templates (overview/functions/logic flow)
│   ├── requirements.txt
│   ├── .env.example
│   └── .env                        # Local config (not in version control)
├── frontend/
│   ├── src/
│   │   ├── views/
│   │   │   ├── HomePage.vue        # Home page
│   │   │   ├── AnalysisConfig.vue  # Analysis config (clone/upload + model selection)
│   │   │   ├── AnalysisResult.vue  # Results page (live Markdown preview + Mermaid)
│   │   │   ├── HistoryPage.vue     # History (with re-analysis)
│   │   │   └── SettingsPage.vue    # AI model configuration
│   │   ├── components/
│   │   │   ├── AppSidebar.vue      # Sidebar navigation + language + 7 theme switcher
│   │   │   ├── Icon.vue            # Inline SVG icon set
│   │   │   ├── MermaidDiagram.vue  # Mermaid diagram rendering
│   │   │   ├── RepoInput.vue       # Repo cloning (SSE real-time progress/speed)
│   │   │   ├── FileUploader.vue    # File upload
│   │   │   ├── ModelSelector.vue   # AI model selector
│   │   │   ├── AnalysisProgress.vue# Analysis progress (step indicator)
│   │   │   ├── ResultSections.vue  # Section navigator + result content
│   │   │   └── CodeViewer.vue      # Code highlighting
│   │   ├── api/                    # Axios + fetch API wrapper
│   │   ├── stores/                 # Pinia state management (with sessionStorage persistence)
│   │   ├── i18n/                   # vue-i18n setup + zh-CN / en locale packs
│   │   ├── router/                 # Vue Router
│   │   └── styles/main.css         # Design tokens (7 themes), layout primitives, Element Plus overrides
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/repos/clone | Clone remote Git repository |
| POST | /api/v1/repos/clone/stream | Clone repository (SSE real-time progress/speed) |
| POST | /api/v1/repos/upload | Upload local code files |
| POST | /api/v1/analysis/ | Create analysis task (background execution) |
| GET | /api/v1/analysis/{id} | Get complete analysis results |
| GET | /api/v1/analysis/{id}/status | Query task status |
| GET | /api/v1/analysis/{id}/stream | SSE streaming AI output |
| GET | /api/v1/models/ | List AI model configurations |
| POST | /api/v1/models/ | Add AI model configuration |
| PUT | /api/v1/models/{id} | Update AI model configuration |
| DELETE | /api/v1/models/{id} | Delete AI model configuration |
| GET | /api/v1/history/ | Analysis history (paginated) |
| DELETE | /api/v1/history/{id} | Delete history record |

## Configuration

Backend configuration is managed through `.env` file. See `backend/.env.example`:

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | Database connection string | sqlite:///./code_analyzer.db |
| UPLOAD_DIR | Upload directory | ./uploads |
| CLONE_DIR | Clone directory | ./cloned_repos |
| MAX_UPLOAD_SIZE_MB | Max upload size | 50 |
| MAX_FILE_SIZE_KB | Max file size for parsing | 500 |
| GIT_PROXY | Git proxy address | None (direct connection) |

## Supported AI Providers

| Provider | provider value | Description |
|----------|----------------|-------------|
| OpenAI | openai | GPT-4o models with streaming support |
| Anthropic | anthropic | Claude models with streaming support |
| Alibaba Qwen | tongyi | Alibaba DashScope OpenAI-compatible API |
| OpenAI Compatible | openai_compat | Third-party compatible interfaces, requires Base URL |

## Themes

Supports 7 themes, switchable via the theme button in top-right corner:

| Theme | Name | Style | Color |
|-------|------|-------|-------|
| midnight | Dark Night | Dark | Indigo #6366f1 |
| ocean | Ocean | Dark | Cyan #0ea5e9 |
| forest | Forest | Dark | Green #22c55e |
| sunset | Sunset | Dark | Orange #f97316 |
| rose | Rose | Dark | Pink #ec4899 |
| nord | Nord | Dark | Ice Blue #88c0d0 |
| light | Light | Light | Indigo #6366f1 |

## Analysis Dimensions

### Project Overview
- Project purpose (what it does, problems it solves, core features)
- Tech stack analysis (frontend/backend/database/toolchain classification)
- Architecture design (patterns, module responsibilities, collaboration)
- Implementation principles and core flow (data flow, key algorithms)
- Generated diagrams: architecture, business flow, module dependency, tech stack diagrams

### Function Analysis
- File purpose and role
- Class and function analysis
- Design pattern recognition
- Generated diagrams: class diagrams, function call relationships

### Logic Flow
- Step-by-step execution logic
- Key implementation details and edge cases
- Generated diagrams: logic flow diagrams, sequence diagrams

### Full Analysis
- Combines all analysis dimensions above

## Development

### Backend Development

```bash
cd backend
source venv/bin/activate
# Make changes to app code
uvicorn app.main:app --reload --port 8000 \
  --reload-exclude "cloned_repos/*" \
  --reload-exclude "uploads/*" \
  --reload-exclude "*.db"
```

### Frontend Development

```bash
cd frontend
npm run dev
```

Access dev server at http://localhost:3000

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Run backend in production
cd backend
uvicorn app.main:app --port 8000
```

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub or check the documentation.
