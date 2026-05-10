import os
from dataclasses import dataclass, field
from typing import List, Optional, Dict

from app.config import settings

EXTENSION_TO_LANGUAGE = {
    ".py": "python",
    ".java": "java",
    ".js": "javascript",
    ".ts": "typescript",
    ".go": "go",
    ".php": "php",
    ".cs": "c_sharp",
    ".c": "c",
    ".cpp": "cpp",
    ".h": "c",
    ".hpp": "cpp",
    ".swift": "swift",
    ".kt": "kotlin",
}


@dataclass
class CodeSymbol:
    name: str
    kind: str  # "function", "class", "method", "import", "interface"
    start_line: int
    end_line: int
    parent: Optional[str] = None
    parameters: List[str] = field(default_factory=list)
    docstring: Optional[str] = None


@dataclass
class FileAnalysis:
    file_path: str
    language: str
    symbols: List[CodeSymbol]
    imports: List[str]
    raw_content: str
    line_count: int


@dataclass
class ProjectStructure:
    name: str
    files: List[FileAnalysis]
    languages: Dict[str, int]
    total_lines: int


class CodeParser:
    def __init__(self):
        self._parsers: Dict = {}

    def _get_parser(self, language: str):
        if language not in self._parsers:
            try:
                from tree_sitter_language_pack import get_parser
                self._parsers[language] = get_parser(language)
            except Exception:
                return None
        return self._parsers[language]

    def parse_project(
        self, project_path: str, target_files: Optional[List[str]] = None
    ) -> ProjectStructure:
        files: List[FileAnalysis] = []
        languages: Dict[str, int] = {}
        total_lines = 0
        skip_dirs = {
            "node_modules", "vendor", "__pycache__", "venv",
            ".git", "build", "dist", ".venv", "env", ".idea",
            ".vscode", "target", "bin", "obj",
        }

        for root, dirs, filenames in os.walk(project_path):
            dirs[:] = [
                d for d in dirs if not d.startswith(".") and d not in skip_dirs
            ]
            for fname in filenames:
                fpath = os.path.join(root, fname)
                rel_path = os.path.relpath(fpath, project_path)

                if target_files and rel_path not in target_files:
                    continue

                ext = os.path.splitext(fname)[1]
                if ext not in EXTENSION_TO_LANGUAGE:
                    continue

                try:
                    file_size = os.path.getsize(fpath)
                except OSError:
                    continue
                if file_size > settings.MAX_FILE_SIZE_KB * 1024:
                    continue

                lang = EXTENSION_TO_LANGUAGE[ext]
                file_analysis = self._parse_file(fpath, rel_path, lang)
                if file_analysis:
                    files.append(file_analysis)
                    languages[lang] = languages.get(lang, 0) + 1
                    total_lines += file_analysis.line_count

        return ProjectStructure(
            name=os.path.basename(project_path),
            files=files,
            languages=languages,
            total_lines=total_lines,
        )

    def _parse_file(
        self, abs_path: str, rel_path: str, language: str
    ) -> Optional[FileAnalysis]:
        try:
            with open(abs_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
        except (OSError, UnicodeDecodeError):
            return None

        symbols: List[CodeSymbol] = []
        imports: List[str] = []

        parser = self._get_parser(language)
        if parser:
            try:
                tree = parser.parse(content.encode("utf-8"))
                self._walk_tree(tree.root_node, language, content, symbols, imports)
            except Exception:
                self._fallback_parse(content, language, symbols, imports)
        else:
            self._fallback_parse(content, language, symbols, imports)

        return FileAnalysis(
            file_path=rel_path,
            language=language,
            symbols=symbols,
            imports=imports,
            raw_content=content,
            line_count=content.count("\n") + 1,
        )

    def _walk_tree(
        self,
        node,
        language: str,
        source: str,
        symbols: List[CodeSymbol],
        imports: List[str],
        parent_class: Optional[str] = None,
    ):
        node_type = node.type

        if node_type in (
            "function_definition", "function_declaration",
            "method_declaration", "method_definition",
            "function_item", "arrow_function",
        ):
            name = self._get_name_child(node)
            params = self._get_parameters(node)
            kind = "method" if parent_class else "function"
            symbols.append(
                CodeSymbol(
                    name=name,
                    kind=kind,
                    start_line=node.start_point[0] + 1,
                    end_line=node.end_point[0] + 1,
                    parent=parent_class,
                    parameters=params,
                )
            )

        elif node_type in (
            "class_definition", "class_declaration",
            "class_specifier", "struct_item",
            "interface_declaration",
        ):
            name = self._get_name_child(node)
            kind = "interface" if "interface" in node_type else "class"
            symbols.append(
                CodeSymbol(
                    name=name,
                    kind=kind,
                    start_line=node.start_point[0] + 1,
                    end_line=node.end_point[0] + 1,
                )
            )
            for child in node.children:
                self._walk_tree(child, language, source, symbols, imports, parent_class=name)
            return

        elif node_type in (
            "import_statement", "import_from_statement",
            "import_declaration", "using_directive",
            "include_directive",
        ):
            text = source[node.start_byte : node.end_byte].strip()
            imports.append(text)

        for child in node.children:
            self._walk_tree(child, language, source, symbols, imports, parent_class)

    def _get_name_child(self, node) -> str:
        for child in node.children:
            if child.type in ("identifier", "name", "type_identifier", "property_identifier"):
                text = child.text
                return text.decode("utf-8") if isinstance(text, bytes) else text
        return "<anonymous>"

    def _get_parameters(self, node) -> List[str]:
        params = []
        for child in node.children:
            if child.type in ("parameters", "formal_parameters", "parameter_list"):
                for param in child.children:
                    if param.type in ("identifier", "parameter", "typed_parameter",
                                      "typed_default_parameter", "simple_parameter"):
                        name_node = param
                        if param.type != "identifier":
                            for sub in param.children:
                                if sub.type == "identifier":
                                    name_node = sub
                                    break
                        text = name_node.text
                        text = text.decode("utf-8") if isinstance(text, bytes) else text
                        if text not in ("(", ")", ",", "self", "this", "cls"):
                            params.append(text)
        return params

    def _fallback_parse(
        self,
        content: str,
        language: str,
        symbols: List[CodeSymbol],
        imports: List[str],
    ):
        """Simple regex-based fallback when tree-sitter is not available."""
        import re

        lines = content.split("\n")
        for i, line in enumerate(lines):
            stripped = line.strip()

            # Detect imports
            if stripped.startswith(("import ", "from ", "#include ", "using ")):
                imports.append(stripped)
                continue

            # Detect class definitions
            class_match = re.match(r"^(?:public\s+|abstract\s+|export\s+)?class\s+(\w+)", stripped)
            if class_match:
                symbols.append(
                    CodeSymbol(
                        name=class_match.group(1),
                        kind="class",
                        start_line=i + 1,
                        end_line=i + 1,
                    )
                )
                continue

            # Detect function definitions
            func_match = re.match(
                r"^(?:def|func|function|fn|public|private|protected|static|async)?\s*(?:def|func|function|fn)?\s+(\w+)\s*\(",
                stripped,
            )
            if func_match:
                symbols.append(
                    CodeSymbol(
                        name=func_match.group(1),
                        kind="function",
                        start_line=i + 1,
                        end_line=i + 1,
                    )
                )
