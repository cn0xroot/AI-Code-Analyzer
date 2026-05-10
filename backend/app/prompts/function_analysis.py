def build_function_analysis_prompt(
    file_path: str, code_content: str, symbols_summary: str
) -> str:
    return f"""对以下代码文件进行深入分析：

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
{code_content[:10000]}
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
