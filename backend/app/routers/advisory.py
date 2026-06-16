from fastapi import APIRouter, HTTPException
from app.services.weather_service import weather_service
from app.services.llm_service import llm_service
from app.services.translation_service import translate_advisory  # NEW
from app.schemas.advisory import AdvisoryRequest, AdvisoryResponse, WeatherData

router = APIRouter(prefix="/advisory", tags=["advisory"])


@router.post("/", response_model=AdvisoryResponse)
async def get_advisory(request: AdvisoryRequest):
    """
    Given a disease label, confidence, and coordinates:
    1. Fetch current weather + forecast from Open-Meteo
    2. Pass disease + weather context to LLM
    3. Optionally translate advisory text via Groq
    4. Return advisory text alongside the weather data

    The frontend calls this after /predict returns a result.
    """
    try:
        weather_data = await weather_service.get_conditions(
            request.lat, request.lon
        )
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Weather service unavailable: {str(e)}"
        )

    try:
        advisory_text = await llm_service.generate_advisory(
            disease_label=request.disease_label,
            confidence=request.confidence,
            weather=weather_data,
        )
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"LLM service unavailable: {str(e)}"
        )

    # NEW — translate if a non-English language was requested
    # translate_advisory is a no-op for "en" or unknown codes
    # falls back to English silently on any Groq error
    if request.target_lang != "en":
        advisory_text = translate_advisory(advisory_text, request.target_lang)

    return AdvisoryResponse(
        disease_label=request.disease_label,
        confidence=request.confidence,
        advisory_text=advisory_text,
        weather=WeatherData(**weather_data),
    )