// Matches the backend /weather and /advisory response contracts exactly

export interface WeatherCurrent {
  temperature: number;
  humidity: number;
  wind_speed: number;
  precipitation: number;
  weather_code: number;
  description: string;
}

export interface WeatherForecastDay {
  date: string;           // "YYYY-MM-DD"
  temp_max: number;
  temp_min: number;
  precipitation_sum: number;
  weather_code: number;
  description: string;
}

export interface WeatherLocation {
  lat: number;
  lon: number;
}

export interface WeatherResponse {
  current: WeatherCurrent;
  forecast: WeatherForecastDay[];
  location: WeatherLocation;
}

// Matches /advisory response contract exactly
export interface AdvisoryResponse {
  disease_label: string;
  confidence: number;
  advisory_text: string;   // contains \n — must render as line breaks
  weather: WeatherResponse;
}

// Spread risk tier — derived from weather + disease context in advisory
export type SpreadRisk = "low" | "moderate" | "high" | "critical";

export function getSpreadRiskColor(risk: SpreadRisk): string {
  switch (risk) {
    case "low":      return "#22c55e";
    case "moderate": return "#f59e0b";
    case "high":     return "#f97316";
    case "critical": return "#ef4444";
  }
}

// Scan history entry — used in dashboard (Phase 4 adds Supabase persistence)
export interface ScanRecord {
  id: string;
  created_at: string;       // ISO timestamp
  image_url: string | null; // null until Phase 4 storage
  disease_label: string;
  confidence: number;
  is_healthy: boolean;
  lat: number | null;
  lon: number | null;
  advisory_text: string | null;
}

// UI state for the scan page — drives component visibility
export type ScanState =
  | "idle"         // no image uploaded
  | "uploading"    // file selected, not yet sent
  | "predicting"   // POST /predict in flight
  | "predicted"    // prediction returned, advisory not yet fetched
  | "advising"     // POST /advisory in flight
  | "complete"     // both prediction and advisory returned
  | "error";       // any API failure

// Geolocation state
export interface GeoLocation {
  lat: number;
  lon: number;
}

export type GeoState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "granted"; location: GeoLocation }
  | { status: "denied" }
  | { status: "error"; message: string };