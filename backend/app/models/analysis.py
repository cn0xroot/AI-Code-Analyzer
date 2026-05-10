import enum

from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class AnalysisStatus(str, enum.Enum):
    PENDING = "pending"
    PARSING = "parsing"
    ANALYZING = "analyzing"
    COMPLETED = "completed"
    FAILED = "failed"


class AnalysisTask(Base):
    __tablename__ = "analysis_tasks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    analysis_type = Column(String(50), nullable=False)  # "overview", "function", "logic_flow", "full"
    status = Column(String(20), default=AnalysisStatus.PENDING)
    ai_provider = Column(String(50), nullable=False)
    ai_model = Column(String(100), nullable=False)
    ai_config_id = Column(Integer, ForeignKey("ai_model_configs.id"), nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime, nullable=True)

    results = relationship("AnalysisResult", back_populates="task", cascade="all, delete-orphan")
    project = relationship("Project")


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(Integer, ForeignKey("analysis_tasks.id"), nullable=False)
    section = Column(String(100), nullable=False)
    content_text = Column(Text, nullable=True)
    mermaid_code = Column(Text, nullable=True)
    diagram_type = Column(String(50), nullable=True)
    file_path = Column(String(1024), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    task = relationship("AnalysisTask", back_populates="results")
