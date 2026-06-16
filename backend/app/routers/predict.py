from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.model_service import model_service
from app.utils.image_utils import decode_and_preprocess, validate_image_size
from app.schemas.prediction import PredictionResponse, PredictionResult

router = APIRouter(prefix="/predict", tags=["prediction"])

HEALTHY_KEYWORDS = {"healthy"}


@router.post("/", response_model=PredictionResponse)
async def predict_disease(file: UploadFile = File(...)):
    """
    Accept a crop leaf image and return top-3 disease predictions.

    - Validates file is an image by MIME type
    - Validates file size (max 10MB)
    - Preprocesses and runs inference
    - Returns top-3 predictions with is_healthy flag
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Uploaded file must be an image (JPEG, PNG, etc.)"
        )

    image_bytes = await file.read()

    try:
        validate_image_size(image_bytes)
        image_array = decode_and_preprocess(image_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        predictions = model_service.predict(image_array)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    top1 = predictions[0]
    is_healthy = any(
        kw in top1["label"].lower() for kw in HEALTHY_KEYWORDS
    )

    return PredictionResponse(
        top3=[PredictionResult(**p) for p in predictions],
        top1_label=top1["label"],
        top1_confidence=top1["confidence"],
        is_healthy=is_healthy,
    )