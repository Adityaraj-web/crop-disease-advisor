from pydantic import BaseModel, Field


class PredictionResult(BaseModel):
    label: str = Field(..., description="Human-readable disease name")
    index: int = Field(..., description="Class index from DISEASE_LABELS")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Prediction probability")


class PredictionResponse(BaseModel):
    top3: list[PredictionResult] = Field(
        ..., description="Top-3 predictions sorted by confidence descending"
    )
    top1_label: str = Field(..., description="Highest confidence prediction label")
    top1_confidence: float = Field(..., ge=0.0, le=1.0)
    is_healthy: bool = Field(
        ..., description="True if top-1 prediction is a healthy class"
    )