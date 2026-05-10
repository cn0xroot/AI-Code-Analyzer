from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func

from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    source_type = Column(String(20), nullable=False)  # "github", "gitlab", "gitee", "upload"
    source_url = Column(String(1024), nullable=True)
    local_path = Column(String(1024), nullable=False)
    language_hint = Column(String(50), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
