MERMAID_RULES = """
## Mermaid Diagram Rules (MUST follow):
- Use valid Mermaid syntax that renders correctly
- For flowcharts: use `flowchart TD` (top-down) or `flowchart LR` (left-right)
- For class diagrams: use `classDiagram`
- For sequence diagrams: use `sequenceDiagram`
- Node IDs must be alphanumeric (no spaces, no special chars). Use labels for display: `A["My Label"]`
- Keep diagrams readable: max ~20 nodes per diagram. Split complex systems into multiple diagrams.
- Use subgraph for grouping related nodes
- Wrap each diagram in ```mermaid code fences
"""
