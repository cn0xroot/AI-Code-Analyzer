import re
from typing import List, Dict

DIAGRAM_TYPES = {
    "flowchart": "flowchart",
    "graph": "flowchart",
    "classdiagram": "classDiagram",
    "sequencediagram": "sequenceDiagram",
    "statediagram": "stateDiagram",
    "erdiagram": "erDiagram",
    "gantt": "gantt",
    "pie": "pie",
}


class MermaidGenerator:
    def parse_response(self, text: str) -> List[Dict]:
        sections = []
        parts = re.split(r"###\s+(.+)", text)

        i = 1
        while i < len(parts) - 1:
            heading = parts[i].strip()
            content = parts[i + 1].strip()
            i += 2

            mermaid_blocks = re.findall(
                r"```mermaid\s*\n(.*?)```", content, re.DOTALL
            )
            text_content = re.sub(
                r"```mermaid\s*\n.*?```", "", content, flags=re.DOTALL
            ).strip()

            if mermaid_blocks:
                for mermaid_code in mermaid_blocks:
                    mermaid_code = mermaid_code.strip()
                    if mermaid_code.upper() == "N/A":
                        continue
                    diagram_type = self._detect_diagram_type(mermaid_code)
                    sections.append(
                        {
                            "section": heading,
                            "text": text_content if text_content else None,
                            "mermaid": mermaid_code,
                            "diagram_type": diagram_type,
                        }
                    )
                    text_content = None
            else:
                if text_content and text_content.upper() != "N/A":
                    sections.append(
                        {
                            "section": heading,
                            "text": text_content,
                            "mermaid": None,
                            "diagram_type": None,
                        }
                    )

        return sections

    def _detect_diagram_type(self, mermaid_code: str) -> str:
        first_line = mermaid_code.strip().split("\n")[0].strip().lower()
        for keyword, dtype in DIAGRAM_TYPES.items():
            if first_line.startswith(keyword):
                return dtype
        return "flowchart"
