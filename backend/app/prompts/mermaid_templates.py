MERMAID_RULES = """
## Mermaid Diagram Rules (follow strictly, otherwise the diagram will not render):

### Syntax
- A flowchart must start with `flowchart TD` or `flowchart LR`
- A class diagram must start with `classDiagram`
- A sequence diagram must start with `sequenceDiagram`

### Node IDs
- Node IDs may only contain ASCII letters, digits and underscores; never use non-ASCII characters, hyphens or spaces
- Correct: `A1`, `nodeStart`, `user_input`
- Wrong: `node-1`, `用户输入`, `my node`

### Labels
- Labels must be wrapped in double quotes: `A1["User input"]`
- Rectangle: `A1["label"]`
- Rounded: `A1("label")`
- Decision (diamond): `A1{"condition"}`
- Stadium: `A1(["label"])`
- Never use HTML tags such as `<br/>` or `<br>` inside labels; use spaces or semicolons instead of line breaks
- Never use these characters inside label text: `&`, `<`, `>`, `#`, `{`, `}`
- To show multiple lines, use multiple nodes instead of HTML line breaks

### Edges
- Use `-->` for directed edges
- Labeled edge: `A1 -->|"label"| B1`
- Edge labels must also be wrapped in double quotes

### Subgraphs
- `subgraph title["Display title"]`
- Must be closed with `end`

### Example (correct syntax):
```mermaid
flowchart TD
    A1["User request"] --> B1["API gateway"]
    B1 --> C1{"Auth check"}
    C1 -->|"pass"| D1["Business logic"]
    C1 -->|"reject"| E1["Return 401"]
    D1 --> F1["Database query"]
    F1 --> G1["Return result"]
```
"""
