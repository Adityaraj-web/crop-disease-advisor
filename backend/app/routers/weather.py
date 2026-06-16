from fastapi import APIRouter, HTTPException, Query
from app.services.weather_service import weather_service
from app.schemas.advisory import WeatherData

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/", response_model=WeatherData)
async def get_weather(
    lat: float = Query(..., ge=-90.0, le=90.0, description="Latitude"),
    lon: float = Query(..., ge=-180.0, le=180.0, description="Longitude"),
):
    """
    Return current weather conditions and 7-day forecast
    for the given coordinates via Open-Meteo.
    """
    try:
        data = await weather_service.get_conditions(lat, lon)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Weather service unavailable: {str(e)}"
        )

    return WeatherData(**data)