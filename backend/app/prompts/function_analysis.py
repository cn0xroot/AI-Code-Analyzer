from app.prompts import normalize_language

_FUNCTION_ZH = """对以下代码文件进行深入分析：

1. **文件功能说明**: 这个文件的作用是什么？在项目中扮演什么角色？

2. **类与函数分析**: 逐一分析每个类和函数的功能、参数、返回值、核心逻辑。

3. **设计模式**: 文件中使用了哪些设计模式？为什么这样设计？

4. **类图** (Mermaid classDiagram): 如果有类，展示类的结构、属性、方法及类之间的关系（继承/组合/依赖）。

5. **函数调用关系图** (Mermaid flowchart): 展示函数之间的调用关系。

## 文件: {file_path}

## 提取的符号信息
{symbols_summary}

## 源代码
```
{code_content}
```

请严格按以下格式输出：

### 文件功能说明
[文件功能、角色描述]

### 类与函数分析
[逐一分析每个类和函数]

### 设计模式
[使用的设计模式及原因]

### 类图
```mermaid
classDiagram
[类图代码，如无类写 "N/A"]
```

### 函数调用关系图
```mermaid
flowchart TD
[函数调用关系]
```"""

_FUNCTION_EN = """Perform an in-depth analysis of the following source file:

1. **File Purpose**: What does this file do and what role does it play in the project?

2. **Classes & Functions**: Analyze each class and function one by one: purpose, parameters, return values and core logic.

3. **Design Patterns**: Which design patterns are used in this file, and why?

4. **Class Diagram** (Mermaid classDiagram): If there are classes, show their structure, attributes, methods and relationships (inheritance / composition / dependency).

5. **Function Call Graph** (Mermaid flowchart): Show the call relationships between functions.

## File: {file_path}

## Extracted Symbols
{symbols_summary}

## Source Code
```
{code_content}
```

Output strictly in the following format:

### File Purpose
[Purpose and role of the file]

### Classes & Functions
[Analysis of each class and function]

### Design Patterns
[Patterns used and why]

### Class Diagram
```mermaid
classDiagram
[Class diagram; write "N/A" if there are no classes]
```

### Function Call Graph
```mermaid
flowchart TD
[Function call relationships]
```"""

_FUNCTION_TEMPLATES = {"zh": _FUNCTION_ZH, "en": _FUNCTION_EN}


def build_function_analysis_prompt(
    file_path: str, code_content: str, symbols_summary: str, language: str = "zh"
) -> str:
    return _FUNCTION_TEMPLATES[normalize_language(language)].format(
        file_path=file_path,
        symbols_summary=symbols_summary,
        code_content=code_content[:10000],
    )
