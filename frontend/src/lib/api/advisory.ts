import type { AdvisoryResponse, WeatherResponse } from "@/types/scan";

// Typed error for advisory and weather calls
export class AdvisoryError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "AdvisoryError";
  }
}

/**
 * Request shape for POST /api/advisory
 * Matches FastAPI /advisory request contract exactly.
 */
export interface AdvisoryRequest {
  disease_label: string;
  confidence: number;
  lat: number;
  lon: number;
  target_lang?: string;   // NEW — BCP-47 code: "en" | "hi" | "bn" | "te" | "ta". Defaults to "en"
}

/**
 * Sends disease label + location to /api/advisory,
 * which proxies to FastAPI POST /advisory.
 * Returns advisory text + full weather data in one response.
 *
 * @param request  AdvisoryRequest matching backend contract
 * @returns        Typed AdvisoryResponse
 */
export async function fetchAdvisory(
  request: AdvisoryRequest
): Promise<AdvisoryResponse> {
  let response: Response;

  try {
    response = await fetch("/api/advisory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        disease_label: request.disease_label,
        confidence: request.confidence,
        lat: request.lat,
        lon: request.lon,
        target_lang: request.target_lang ?? "en",   // NEW — pass through, default "en"
      }),
    });
  } catch {
    throw new AdvisoryError(
      "Could not reach the advisory service. Is the backend running?"
    );
  }

  if (!response.ok) {
    let message = `Advisory failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.detail) message = body.detail;
    } catch {
      // response body not JSON — use default message
    }
    throw new AdvisoryError(message, response.status);
  }

  const data: AdvisoryResponse = await response.json();
  return data;
}

/**
 * Fetches current weather + forecast for a given location.
 * Calls /api/weather which proxies to FastAPI GET /weather.
 *
 * Kept separate from fetchAdvisory so the weather strip
 * can load independently before the LLM advisory is ready.
 *
 * @param lat  Latitude
 * @param lon  Longitude
 * @returns    Typed WeatherResponse
 */
export async function fetchWeather(
  lat: number,
  lon: number
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
  });

  let response: Response;

  try {
    response = await fetch(`/api/weather?${params.toString()}`, {
      method: "GET",
    });
  } catch {
    throw new AdvisoryError(
      "Could not reach the weather service. Is the backend running?"
    );
  }

  if (!response.ok) {
    let message = `Weather fetch failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.detail) message = body.detail;
    } catch {
      // response body not JSON — use default message
    }
    throw new AdvisoryError(message, response.status);
  }

  const data: WeatherResponse = await response.json();
  return data;
}