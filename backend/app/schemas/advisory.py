from pydantic import BaseModel, Field


class WeatherCurrent(BaseModel):
    temperature: float
    humidity: float
    wind_speed: float
    precipitation: float
    weather_code: int
    description: str


class WeatherForecastDay(BaseModel):
    date: str
    temp_max: float
    temp_min: float
    precipitation_sum: float
    weather_code: int
    description: str


class WeatherData(BaseModel):
    current: WeatherCurrent
    forecast: list[WeatherForecastDay]
    location: dict[str, float]


class AdvisoryRequest(BaseModel):
    disease_label: str = Field(..., description="Top-1 disease label from prediction")
    confidence: float = Field(..., ge=0.0, le=1.0)
    lat: float = Field(..., ge=-90.0, le=90.0)
    lon: float = Field(..., ge=-180.0, le=180.0)
    target_lang: str = Field(default="en", description="BCP-47 language code for translation")  # NEW


class AdvisoryResponse(BaseModel):
    disease_label: str
    confidence: float
    advisory_text: str = Field(..., description="LLM-generated treatment protocol")
    weather: WeatherData