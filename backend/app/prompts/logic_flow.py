def build_logic_flow_prompt(
    file_path: str,
    code_content: str,
    function_name: str = None,
) -> str:
    scope = f"函数 `{function_name}`" if function_name else "主要逻辑"
    return f"""对以下代码中 {scope} 的逻辑流程进行深入分析：

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
{code_content[:10000]}
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
