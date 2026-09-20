from app.prompts import LANGUAGE_DIRECTIVE, normalize_language

SYSTEM_PROMPT_BASE = """You are an expert software architect and code analyst.
You analyze codebases and produce clear, accurate, comprehensive technical documentation.
When generating Mermaid diagrams, use valid Mermaid syntax.
Always wrap Mermaid code in ```mermaid code blocks.
{language_directive}
Be thorough and detailed in your analysis."""


def build_system_prompt(language: str = "zh") -> str:
    return SYSTEM_PROMPT_BASE.format(
        language_directive=LANGUAGE_DIRECTIVE[normalize_language(language)]
    )


SYSTEM_PROMPT = build_system_prompt("zh")


_OVERVIEW_ZH = """对以下项目进行全面深入的分析，输出以下内容：

1. **项目功能概述**: 这个项目是做什么的？解决了什么问题？面向什么用户？核心功能有哪些？请详细说明（3-5段）。

2. **技术栈分析**: 列出项目使用的所有技术、框架、库，按前端/后端/数据库/工具链等分类说明。解释为什么选择这些技术。

3. **架构设计**: 项目的整体架构是什么？采用了什么架构模式（MVC/微服务/单体/事件驱动等）？各个模块的职责是什么？模块之间如何协作？

4. **实现原理与核心流程**: 项目的核心业务流程是怎样的？从用户输入到最终输出，数据是如何流转的？关键算法或核心逻辑是什么？

5. **架构图** (Mermaid flowchart): 绘制项目的高层架构图，展示所有主要模块、它们的职责及模块间的连接关系。

6. **核心业务流程图** (Mermaid flowchart): 绘制项目最核心的业务流程，从输入到输出的完整数据流转。

7. **模块依赖关系图** (Mermaid flowchart): 展示各模块/包之间的依赖关系。

8. **技术栈组成图** (Mermaid mindmap or flowchart): 展示项目的技术栈组成。

## 项目信息
- 项目名: {project_name}
- 编程语言: {lang_summary}
- 总代码行数: {total_lines}

## 文件结构
{file_tree}

## 发现的关键符号（类/函数/方法）
{sample_symbols}

请严格按以下格式输出：

### 项目功能概述
[详细的功能描述，3-5段]

### 技术栈分析
[按分类列出所有技术栈]

### 架构设计
[架构模式、模块职责、协作方式]

### 实现原理与核心流程
[核心业务流程、数据流转、关键算法]

### 架构图
```mermaid
flowchart TD
[高层架构图]
```

### 核心业务流程图
```mermaid
flowchart TD
[核心业务流程]
```

### 模块依赖关系图
```mermaid
flowchart LR
[模块依赖关系]
```

### 技术栈组成图
```mermaid
flowchart TD
[技术栈分层展示]
```"""

_OVERVIEW_EN = """Perform a comprehensive, in-depth analysis of the following project and produce:

1. **Project Overview**: What does this project do? What problem does it solve? Who are the target users? What are the core features? Explain in detail (3-5 paragraphs).

2. **Technology Stack**: List every technology, framework and library used, grouped by frontend / backend / database / toolchain, and explain why they were chosen.

3. **Architecture Design**: What is the overall architecture? Which architectural pattern is used (MVC / microservices / monolith / event-driven, etc.)? What are the responsibilities of each module and how do they collaborate?

4. **Implementation Principles & Core Flow**: What is the core business flow? How does data move from user input to final output? What are the key algorithms or core logic?

5. **Architecture Diagram** (Mermaid flowchart): A high-level architecture diagram showing all major modules, their responsibilities and the connections between them.

6. **Core Business Flow Diagram** (Mermaid flowchart): The most important business flow, showing the complete data path from input to output.

7. **Module Dependency Diagram** (Mermaid flowchart): Dependencies between modules / packages.

8. **Technology Stack Diagram** (Mermaid mindmap or flowchart): The composition of the technology stack.

## Project Information
- Project name: {project_name}
- Languages: {lang_summary}
- Total lines of code: {total_lines}

## File Structure
{file_tree}

## Key Symbols Found (classes / functions / methods)
{sample_symbols}

Output strictly in the following format:

### Project Overview
[Detailed description, 3-5 paragraphs]

### Technology Stack
[All technologies grouped by category]

### Architecture Design
[Architecture pattern, module responsibilities, collaboration]

### Implementation Principles & Core Flow
[Core business flow, data movement, key algorithms]

### Architecture Diagram
```mermaid
flowchart TD
[High-level architecture]
```

### Core Business Flow Diagram
```mermaid
flowchart TD
[Core business flow]
```

### Module Dependency Diagram
```mermaid
flowchart LR
[Module dependencies]
```

### Technology Stack Diagram
```mermaid
flowchart TD
[Layered technology stack]
```"""

_OVERVIEW_TEMPLATES = {"zh": _OVERVIEW_ZH, "en": _OVERVIEW_EN}


def build_overview_prompt(
    project_name: str,
    file_list: list[str],
    languages: dict[str, int],
    total_lines: int,
    sample_symbols: str,
    language: str = "zh",
) -> str:
    file_tree = "\n".join(f"  - {f}" for f in file_list[:150])
    lang_summary = ", ".join(f"{lang}: {count} files" for lang, count in languages.items())

    return _OVERVIEW_TEMPLATES[normalize_language(language)].format(
        project_name=project_name,
        lang_summary=lang_summary,
        total_lines=total_lines,
        file_tree=file_tree,
        sample_symbols=sample_symbols,
    )
