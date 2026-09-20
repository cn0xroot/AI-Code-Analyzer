from app.prompts import normalize_language

_LOGIC_ZH = """对以下代码中 {scope} 的逻辑流程进行深入分析：

1. **逻辑流程说明**: 从入口到出口，逐步描述代码的执行逻辑，包括：
   - 输入参数的处理
   - 条件分支和判断逻辑
   - 循环处理
   - 错误处理和异常处理
   - 返回值和输出

2. **关键实现细节**: 有哪些值得注意的实现技巧？有哪些边界情况处理？

3. **逻辑流程图** (Mermaid flowchart): 详细的逻辑流程图，包含决策节点、循环、异常处理路径。

4. **时序图** (Mermaid sequenceDiagram): 如果涉及多个组件/类/服务之间的交互，展示调用时序。

## 文件: {file_path}

## 源代码
```
{code_content}
```

请严格按以下格式输出：

### 逻辑流程说明
[逐步描述执行逻辑]

### 关键实现细节
[实现技巧、边界情况]

### 逻辑流程图
```mermaid
flowchart TD
[详细逻辑流程图]
```

### 时序图
```mermaid
sequenceDiagram
[时序图代码，如不适用写 "N/A"]
```"""

_LOGIC_EN = """Perform an in-depth analysis of the logic flow of {scope} in the following code:

1. **Logic Flow**: Describe the execution logic step by step from entry to exit, including:
   - Handling of input parameters
   - Conditional branches and decision logic
   - Loops
   - Error and exception handling
   - Return values and outputs

2. **Key Implementation Details**: Notable implementation techniques and edge-case handling.

3. **Logic Flow Diagram** (Mermaid flowchart): A detailed flowchart including decision nodes, loops and exception paths.

4. **Sequence Diagram** (Mermaid sequenceDiagram): If multiple components / classes / services interact, show the call sequence.

## File: {file_path}

## Source Code
```
{code_content}
```

Output strictly in the following format:

### Logic Flow
[Step-by-step execution logic]

### Key Implementation Details
[Techniques and edge cases]

### Logic Flow Diagram
```mermaid
flowchart TD
[Detailed logic flow]
```

### Sequence Diagram
```mermaid
sequenceDiagram
[Sequence diagram; write "N/A" if not applicable]
```"""

_LOGIC_TEMPLATES = {"zh": _LOGIC_ZH, "en": _LOGIC_EN}
_SCOPE = {
    "zh": lambda fn: f"函数 `{fn}`" if fn else "主要逻辑",
    "en": lambda fn: f"the function `{fn}`" if fn else "the main logic",
}


def build_logic_flow_prompt(
    file_path: str,
    code_content: str,
    function_name: str = None,
    language: str = "zh",
) -> str:
    lang = normalize_language(language)
    return _LOGIC_TEMPLATES[lang].format(
        scope=_SCOPE[lang](function_name),
        file_path=file_path,
        code_content=code_content[:10000],
    )
