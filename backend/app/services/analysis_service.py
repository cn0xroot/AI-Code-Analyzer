from datetime import datetime
from typing import Optional, List

from sqlalchemy.orm import Session

from app.models.analysis import AnalysisTask, AnalysisResult, AnalysisStatus
from app.models.model_config import AIModelConfig
from app.models.project import Project
from app.schemas.analysis import AnalysisCreate
from app.services.code_parser import CodeParser, ProjectStructure, FileAnalysis
from app.services.ai_analyzer import AIAnalyzer
from app.services.mermaid_generator import MermaidGenerator
from app.prompts.overview import SYSTEM_PROMPT, build_overview_prompt
from app.prompts.function_analysis import build_function_analysis_prompt
from app.prompts.logic_flow import build_logic_flow_prompt
from app.prompts.mermaid_templates import MERMAID_RULES

# In-memory streaming output for real-time display
# { task_id: { "streaming_text": "...", "current_file": "...", "phase": "..." } }
_analysis_live = {}


def get_live_output(task_id: int) -> dict:
    return _analysis_live.get(task_id, {})


class AnalysisService:
    def __init__(self, db: Session):
        self.db = db
        self.parser = CodeParser()
        self.ai = AIAnalyzer(db)
        self.mermaid = MermaidGenerator()

    def create_task(self, request: AnalysisCreate) -> AnalysisTask:
        ai_config = (
            self.db.query(AIModelConfig)
            .filter(AIModelConfig.id == request.ai_config_id)
            .first()
        )
        if not ai_config:
            raise ValueError(f"AI model config {request.ai_config_id} not found")

        task = AnalysisTask(
            project_id=request.project_id,
            analysis_type=request.analysis_type,
            status=AnalysisStatus.PENDING,
            ai_provider=ai_config.provider,
            ai_model=ai_config.model_id,
            ai_config_id=ai_config.id,
        )
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def get_task(self, task_id: int) -> Optional[AnalysisTask]:
        return (
            self.db.query(AnalysisTask)
            .filter(AnalysisTask.id == task_id)
            .first()
        )

    async def _stream_ai(self, task_id: int, config_id: int,
                          system: str, prompt: str, phase: str, file_path: str = "") -> str:
        """Call AI with streaming, updating live output in memory."""
        _analysis_live[task_id] = {
            "streaming_text": "",
            "current_file": file_path,
            "phase": phase,
        }
        full_text = ""
        async for chunk in self.ai.analyze_stream(config_id, system, prompt):
            full_text += chunk
            _analysis_live[task_id] = {
                "streaming_text": full_text,
                "current_file": file_path,
                "phase": phase,
            }
        return full_text

    async def run_analysis(self, task_id: int):
        task = self.get_task(task_id)
        if not task:
            return

        try:
            task.status = AnalysisStatus.PARSING
            self.db.commit()

            project = (
                self.db.query(Project)
                .filter(Project.id == task.project_id)
                .first()
            )
            if not project:
                raise ValueError("Project not found")

            structure = self.parser.parse_project(project.local_path)

            task.status = AnalysisStatus.ANALYZING
            self.db.commit()

            if task.analysis_type in ("overview", "full"):
                await self._analyze_overview(task, structure)

            if task.analysis_type in ("function", "full"):
                await self._analyze_functions(task, structure)

            if task.analysis_type in ("logic_flow", "full"):
                await self._analyze_logic(task, structure)

            task.status = AnalysisStatus.COMPLETED
            task.completed_at = datetime.utcnow()
            self.db.commit()

        except Exception as e:
            task.status = AnalysisStatus.FAILED
            task.error_message = str(e)[:1000]
            self.db.commit()
        finally:
            _analysis_live.pop(task_id, None)

    async def _analyze_overview(
        self, task: AnalysisTask, structure: ProjectStructure
    ):
        symbols_summary = self._build_symbols_summary(structure, max_files=20)
        file_list = [f.file_path for f in structure.files]

        prompt = build_overview_prompt(
            structure.name,
            file_list,
            structure.languages,
            structure.total_lines,
            symbols_summary,
        )
        system = SYSTEM_PROMPT + "\n" + MERMAID_RULES

        content = await self._stream_ai(
            task.id, task.ai_config_id, system, prompt, "overview"
        )
        sections = self.mermaid.parse_response(content)

        for section in sections:
            result = AnalysisResult(
                task_id=task.id,
                section=section["section"],
                content_text=section.get("text"),
                mermaid_code=section.get("mermaid"),
                diagram_type=section.get("diagram_type"),
            )
            self.db.add(result)
        self.db.commit()

    async def _analyze_functions(
        self, task: AnalysisTask, structure: ProjectStructure
    ):
        significant_files = sorted(
            structure.files, key=lambda f: len(f.symbols), reverse=True
        )[:10]

        for file_analysis in significant_files:
            symbols_str = self._format_file_symbols(file_analysis)
            prompt = build_function_analysis_prompt(
                file_analysis.file_path,
                file_analysis.raw_content,
                symbols_str,
            )
            system = SYSTEM_PROMPT + "\n" + MERMAID_RULES

            content = await self._stream_ai(
                task.id, task.ai_config_id, system, prompt,
                "function", file_analysis.file_path
            )
            sections = self.mermaid.parse_response(content)

            for section in sections:
                result = AnalysisResult(
                    task_id=task.id,
                    section=section["section"],
                    content_text=section.get("text"),
                    mermaid_code=section.get("mermaid"),
                    diagram_type=section.get("diagram_type"),
                    file_path=file_analysis.file_path,
                )
                self.db.add(result)
        self.db.commit()

    async def _analyze_logic(
        self, task: AnalysisTask, structure: ProjectStructure
    ):
        target_files = sorted(
            structure.files, key=lambda f: len(f.symbols), reverse=True
        )[:5]

        for file_analysis in target_files:
            prompt = build_logic_flow_prompt(
                file_analysis.file_path,
                file_analysis.raw_content,
            )
            system = SYSTEM_PROMPT + "\n" + MERMAID_RULES

            content = await self._stream_ai(
                task.id, task.ai_config_id, system, prompt,
                "logic_flow", file_analysis.file_path
            )
            sections = self.mermaid.parse_response(content)

            for section in sections:
                result = AnalysisResult(
                    task_id=task.id,
                    section=section["section"],
                    content_text=section.get("text"),
                    mermaid_code=section.get("mermaid"),
                    diagram_type=section.get("diagram_type"),
                    file_path=file_analysis.file_path,
                )
                self.db.add(result)
        self.db.commit()

    def _build_symbols_summary(
        self, structure: ProjectStructure, max_files: int = 20
    ) -> str:
        lines = []
        for fa in structure.files[:max_files]:
            if fa.symbols:
                lines.append(f"\n## {fa.file_path}")
                for sym in fa.symbols[:15]:
                    params = f"({', '.join(sym.parameters)})" if sym.parameters else ""
                    parent = f" (in {sym.parent})" if sym.parent else ""
                    lines.append(f"  - {sym.kind}: {sym.name}{params}{parent}")
        return "\n".join(lines)

    def _format_file_symbols(self, fa: FileAnalysis) -> str:
        lines = []
        for sym in fa.symbols:
            params = f"({', '.join(sym.parameters)})" if sym.parameters else ""
            parent = f" (in {sym.parent})" if sym.parent else ""
            doc = f' -- "{sym.docstring[:80]}"' if sym.docstring else ""
            lines.append(
                f"- {sym.kind}: {sym.name}{params}{parent} [L{sym.start_line}-{sym.end_line}]{doc}"
            )
        if fa.imports:
            lines.append("\nImports:")
            for imp in fa.imports[:20]:
                lines.append(f"  {imp}")
        return "\n".join(lines)
