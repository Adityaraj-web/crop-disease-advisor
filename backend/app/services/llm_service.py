import ollama
from groq import Groq
from app.config import settings


ADVISORY_PROMPT_TEMPLATE = """You are an expert agricultural plant pathologist. A farmer has uploaded a crop leaf image and the disease detection system has identified the following:

Disease detected: {disease_label}
Confidence: {confidence:.1%}

Current weather conditions:
- Temperature: {temperature}°C
- Humidity: {humidity}%
- Wind speed: {wind_speed} km/h
- Precipitation: {precipitation} mm
- Conditions: {weather_description}

7-day forecast summary: {forecast_summary}

Provide a concise, practical advisory covering:
1. Disease confirmation and brief description (2-3 sentences)
2. Immediate treatment steps (3-5 bullet points)
3. Weather-based spread risk assessment for the next 7 days (2-3 sentences)
4. Preventive measures for the coming week (2-3 bullet points)

Keep the response practical and farmer-friendly. Avoid excessive technical jargon."""


def _build_forecast_summary(forecast: list[dict]) -> str:
    """Condense 7-day forecast into a single sentence for the prompt."""
    high_temps = [d["temp_max"] for d in forecast]
    precip_days = sum(1 for d in forecast if d["precipitation_sum"] > 1.0)
    avg_high = sum(high_temps) / len(high_temps)

    return (
        f"Average high of {avg_high:.1f}°C over 7 days, "
        f"{precip_days} day(s) with significant rainfall (>1mm)."
    )


class LLMService:
    def _build_prompt(
        self,
        disease_label: str,
        confidence: float,
        weather: dict,
    ) -> str:
        current = weather["current"]
        forecast_summary = _build_forecast_summary(weather["forecast"])

        return ADVISORY_PROMPT_TEMPLATE.format(
            disease_label=disease_label,
            confidence=confidence,
            temperature=current["temperature"],
            humidity=current["humidity"],
            wind_speed=current["wind_speed"],
            precipitation=current["precipitation"],
            weather_description=current["description"],
            forecast_summary=forecast_summary,
        )

    async def generate_advisory(
        self,
        disease_label: str,
        confidence: float,
        weather: dict,
    ) -> str:
        """
        Generate a treatment advisory using the configured LLM provider.

        Args:
            disease_label: Human-readable disease name from DISEASE_LABELS.
            confidence: Top-1 prediction probability in [0, 1].
            weather: Dict returned by WeatherService.get_conditions().

        Returns:
            Advisory text as a plain string.
        """
        prompt = self._build_prompt(disease_label, confidence, weather)

        if settings.llm_provider == "groq":
            return await self._call_groq(prompt)
        return await self._call_ollama(prompt)

    async def _call_ollama(self, prompt: str) -> str:
        client = ollama.AsyncClient(host=settings.ollama_base_url)
        response = await client.chat(
            model=settings.ollama_model,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.message.content

    async def _call_groq(self, prompt: str) -> str:
        client = Groq(api_key=settings.groq_api_key)
        response = client.chat.completions.create(
            model=settings.groq_model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1024,
        )
        return response.choices[0].message.content


llm_service = LLMService()