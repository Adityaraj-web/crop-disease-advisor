"""
translation_service.py
Translates advisory text into Indian languages using Groq's LLaMA 3.
Called only when the user explicitly requests a non-English language.
"""

from groq import Groq
from app.config import settings  # same pattern as llm_service.py


# Initialise once at module level — reused across requests
_client: Groq | None = None


def _get_client() -> Groq:
    global _client
    if _client is None:
        if not settings.groq_api_key:
            raise RuntimeError(
                "GROQ_API_KEY is not set. Add it to backend/.env as GROQ_API_KEY=gsk_..."
            )
        _client = Groq(api_key=settings.groq_api_key)
    return _client


# Supported languages — code → full name for the prompt
SUPPORTED_LANGUAGES: dict[str, str] = {
    "en": "English",
    "hi": "Hindi",
    "bn": "Bengali",
    "te": "Telugu",
    "ta": "Tamil",
}


def translate_advisory(text: str, target_lang: str) -> str:
    """
    Translate advisory_text into the target language.

    Args:
        text:        The English advisory text to translate.
        target_lang: BCP-47 language code — one of: hi, bn, te, ta.
                     Passing "en" is a no-op and returns the original text.

    Returns:
        Translated string. Falls back to original English text on any error
        so the frontend always gets a usable response.
    """
    # No-op for English or unsupported codes
    if target_lang == "en" or target_lang not in SUPPORTED_LANGUAGES:
        return text

    language_name = SUPPORTED_LANGUAGES[target_lang]

    prompt = f"""You are an agricultural advisory translator.
Translate the following crop disease treatment advisory into {language_name}.

Rules:
- Translate naturally and clearly for farmers
- Keep technical disease names (like "Late blight", "Early blight") in English as farmers recognise them
- Keep chemical/fungicide names in English
- Keep percentage numbers and measurements as-is
- Do NOT add any preamble, explanation, or notes — output ONLY the translated text

Advisory to translate:
{text}"""

    try:
        client = _get_client()
        response = client.chat.completions.create(
            model=settings.groq_model,  # uses same model as llm_service for consistency
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2048,
            temperature=0.3,  # low temp for consistent translation
        )
        translated = response.choices[0].message.content
        return translated.strip() if translated else text

    except Exception as e:
        # Non-fatal — log and return original English text
        print(f"[translation_service] Translation failed for lang={target_lang}: {e}")
        return text