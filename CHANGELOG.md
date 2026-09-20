# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

**Languages:** [English](CHANGELOG.md) | [中文](CHANGELOG.zh-CN.md)

## [1.1.0] - 2026-09-20

### Added
- **Bilingual UI (English / 中文)** via vue-i18n: language switcher in the sidebar, Element Plus locale follows the UI language, preference is remembered, and `?lang=en` / `?lang=zh` overrides it in the URL. The default follows the browser language.
- **AI output language**: an "Output language" option on the Analyze page and in the Re-analyze dialog; prompts now ship in both Chinese and English. The task language is stored (`analysis_tasks.language`, auto-migrated on startup) and the AI chat answers in the current UI language.
- **Model config editing**: an Edit button on each model card. Leaving the API key blank keeps the stored key; provider and model ID can now be changed (`PUT /api/v1/models/{id}`).
- **Fetch available models**: `POST /api/v1/models/available` lists model IDs from the provider (OpenAI, Alibaba Qwen and OpenAI-compatible relays via `GET /models`; Anthropic via the SDK). The Model ID field became a searchable select with a "Fetch models" button, so the key and Base URL are validated before saving.
- English `README.md` as the default README, with the Chinese version moved to `README.zh-CN.md`; a "Prerequisites & Dependencies" section listing every system requirement and package.
- `.gitignore` for `node_modules`, build output, Python caches, virtualenv, SQLite database, uploads and cloned repositories.
- `httpx[socks]` dependency so AI SDK calls work when `all_proxy=socks5://…` is set.

### Changed
- **Web UI redesign** (from a Claude Design canvas): a 240 px sidebar workbench layout replaces the top navigation; new design tokens (mint accent on a cool neutral ground), Space Grotesk / IBM Plex Sans / IBM Plex Mono typography, inline SVG icon set. The 7 themes are kept as token variants.
  - Home: hero with an inline repository URL field, feature cards and a recent-analyses list.
  - Analyze: segmented source switch, platform pills, analysis-type cards with descriptions, output-language toggle.
  - Result: stepper + live streaming panel + task card while running; section navigator, text/diagram cards and a docked AI chat panel when complete.
  - History: search and status/type filters, status chips, inline actions.
  - Models: card grid, "Set as default", provider picker cards in the add/edit dialog.
- AI responses are now split only on the section headings each prompt asks for, so sub-headings the model adds inside a section no longer explode into hundreds of sections.
- Mermaid syntax rules in the system prompt are written in English (labels may still be Chinese when Chinese output is requested).
- Timestamps in API responses are serialized as UTC (`…Z`), so the browser shows correct local times and the elapsed counter works in every timezone.
- Built frontend assets (`frontend/dist`) and `node_modules` were removed from version control; the repository history was rewritten to drop them.

### Fixed
- An OpenAI-compatible Base URL without a path (e.g. `https://relay.example.com`) hit the relay's web page instead of the API; the empty response was silently treated as success, leaving analyses "completed" with no results and chat replies blank. The Base URL is now normalized to end in `/v1`, and an empty model response fails the task with a clear message.
- The analysis detail endpoint did not return the task language, so English tasks were labelled as Chinese in the UI.
- The History actions column overlapped the language column in English.

## [1.0.0] - 2026-05-10

### Added
- Initial release: repository cloning from GitHub / GitLab / Gitee with live progress, local upload, tree-sitter parsing for 10 languages, streaming AI analysis (OpenAI, Anthropic, Alibaba Qwen, OpenAI-compatible), Mermaid diagram rendering, analysis history and 7 UI themes.

[1.1.0]: https://github.com/cn0xroot/AI-Code-Analyzer/compare/d1fc3c1...v1.1.0
[1.0.0]: https://github.com/cn0xroot/AI-Code-Analyzer/commits/d1fc3c1
