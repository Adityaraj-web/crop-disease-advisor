import httpx
from app.config import settings


# WMO Weather Interpretation Codes → human-readable description
# https://open-meteo.com/en/docs#weathervariables
WMO_CODES = {
    0: "Clear sky",
    1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Icy fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
    80: "Slight showers", 81: "Moderate showers", 82: "Violent showers",
    95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail",
}


class WeatherService:
    async def get_conditions(self, lat: float, lon: float) -> dict:
        """
        Fetch current weather + 7-day daily forecast from Open-Meteo.

        Returns a structured dict with:
            - current: temperature, humidity, wind_speed, precipitation,
                       weather_code, description
            - forecast: list of 7 dicts (date, temp_max, temp_min,
                        precipitation_sum, weather_code, description)
            - location: {lat, lon}
        """
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": [
                "temperature_2m",
                "relative_humidity_2m",
                "precipitation",
                "weather_code",
                "wind_speed_10m",
            ],
            "daily": [
                "weather_code",
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_sum",
            ],
            "timezone": "auto",
            "forecast_days": 7,
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(settings.open_meteo_base_url, params=params)
            response.raise_for_status()
            data = response.json()

        current_raw = data["current"]
        daily_raw = data["daily"]

        current = {
            "temperature": current_raw["temperature_2m"],
            "humidity": current_raw["relative_humidity_2m"],
            "wind_speed": current_raw["wind_speed_10m"],
            "precipitation": current_raw["precipitation"],
            "weather_code": current_raw["weather_code"],
            "description": WMO_CODES.get(current_raw["weather_code"], "Unknown"),
        }

        forecast = [
            {
                "date": daily_raw["time"][i],
                "temp_max": daily_raw["temperature_2m_max"][i],
                "temp_min": daily_raw["temperature_2m_min"][i],
                "precipitation_sum": daily_raw["precipitation_sum"][i],
                "weather_code": daily_raw["weather_code"][i],
                "description": WMO_CODES.get(daily_raw["weather_code"][i], "Unknown"),
            }
            for i in range(len(daily_raw["time"]))
        ]

        return {
            "current": current,
            "forecast": forecast,
            "location": {"lat": lat, "lon": lon},
        }


weather_service = WeatherService()