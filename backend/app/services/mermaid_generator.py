import re
from typing import List, Dict, Optional

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


def _normalize_heading(text: str) -> str:
    text = re.sub(r"[*_`#]", "", text)
    text = re.sub(r"^\s*\d+[.、)]\s*", "", text)
    return re.sub(r"[\s:：\-–—()（）]+", "", text).lower()


class MermaidGenerator:
    def parse_response(self, text: str, expected_sections: Optional[List[str]] = None) -> List[Dict]:
        """Split an AI response into sections by `### heading` lines.

        When expected_sections is given, only headings matching them start a new
        section; other `###` lines the model adds inside a section stay in its text.
        """
        matches = list(re.finditer(r"^###\s+(.+?)\s*$", text, re.MULTILINE))
        if expected_sections:
            wanted = {_normalize_heading(h) for h in expected_sections}
            filtered = [m for m in matches if _normalize_heading(m.group(1)) in wanted]
            if filtered:
                matches = filtered

        sections = []
        for idx, m in enumerate(matches):
            heading = re.sub(r"[*_`]", "", m.group(1)).strip()
            end = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
            content = text[m.end():end].strip()

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
