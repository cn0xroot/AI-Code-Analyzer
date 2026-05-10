from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.api.deps import get_db
from app.schemas.model_config import ModelConfigCreate, ModelConfigResponse, ModelConfigUpdate
from app.models.model_config import AIModelConfig

router = APIRouter(prefix="/models", tags=["model-config"])


@router.get("/", response_model=List[ModelConfigResponse])
async def list_models(db: Session = Depends(get_db)):
    return db.query(AIModelConfig).all()


@router.post("/", response_model=ModelConfigResponse)
async def create_model(config: ModelConfigCreate, db: Session = Depends(get_db)):
    if config.is_default:
        db.query(AIModelConfig).filter(AIModelConfig.is_default == True).update(
            {"is_default": False}
        )
    model = AIModelConfig(**config.model_dump())
    db.add(model)
    db.commit()
    db.refresh(model)
    return model


@router.get("/{config_id}", response_model=ModelConfigResponse)
async def get_model(config_id: int, db: Session = Depends(get_db)):
    model = db.query(AIModelConfig).filter(AIModelConfig.id == config_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model config not found")
    return model


@router.put("/{config_id}", response_model=ModelConfigResponse)
async def update_model(
    config_id: int, updates: ModelConfigUpdate, db: Session = Depends(get_db)
):
    model = db.query(AIModelConfig).filter(AIModelConfig.id == config_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model config not found")
    update_data = updates.model_dump(exclude_unset=True)
    if update_data.get("is_default"):
        db.query(AIModelConfig).filter(AIModelConfig.is_default == True).update(
            {"is_default": False}
        )
    for key, value in update_data.items():
        setattr(model, key, value)
    db.commit()
    db.refresh(model)
    return model


@router.delete("/{config_id}")
async def delete_model(config_id: int, db: Session = Depends(get_db)):
    from app.models.analysis import AnalysisTask

    model = db.query(AIModelConfig).filter(AIModelConfig.id == config_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model config not found")

    # Nullify foreign key references in analysis tasks so they don't block deletion
    db.query(AnalysisTask).filter(
        AnalysisTask.ai_config_id == config_id
    ).update({"ai_config_id": None}, synchronize_session="fetch")

    db.delete(model)
    db.commit()
    return {"detail": "Deleted"}
