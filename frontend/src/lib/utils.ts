import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── shadcn/ui required helper ───────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Confidence formatting ────────────────────────────────────

// Returns confidence as a 0–100 integer for display
export function toPercent(confidence: number): number {
  return Math.round(confidence * 100);
}

// Returns confidence as a formatted string e.g. "80.7%"
export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(1)}%`;
}

// ─── SVG arc helpers — confidence ring ───────────────────────

// Total sweep angle of the arc in degrees (270° = three-quarter circle)
const ARC_SWEEP = 270;
// Arc starts at bottom-left (135° from top = 225° in SVG coordinates)
const ARC_START_DEG = 135;

/**
 * Converts polar coordinates to cartesian for SVG path drawing.
 */
function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/**
 * Builds an SVG arc path string for the confidence ring.
 * @param cx        center x
 * @param cy        center y
 * @param r         radius
 * @param confidence  0.0 – 1.0
 */
export function buildArcPath(
  cx: number,
  cy: number,
  r: number,
  confidence: number
): string {
  const clampedConfidence = Math.min(1, Math.max(0, confidence));
  const endAngle = ARC_START_DEG + ARC_SWEEP * clampedConfidence;

  const start = polarToCartesian(cx, cy, r, ARC_START_DEG);
  const end = polarToCartesian(cx, cy, r, endAngle);

  const largeArc = ARC_SWEEP * clampedConfidence > 180 ? 1 : 0;

  return [
    `M ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
  ].join(" ");
}

/**
 * Builds the full background track arc path (always full 270°).
 */
export function buildTrackPath(cx: number, cy: number, r: number): string {
  return buildArcPath(cx, cy, r, 1);
}

// ─── Number animation helper ──────────────────────────────────

/**
 * Returns intermediate value for count-up animations.
 * Use with requestAnimationFrame or Framer Motion's useMotionValue.
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

// ─── Advisory text formatting ─────────────────────────────────

/**
 * Splits advisory_text on \n into paragraphs for rendering.
 * Filters empty strings from double newlines.
 */
export function parseAdvisoryText(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

// ─── Weather helpers ──────────────────────────────────────────

/**
 * Returns a weather emoji for a given WMO weather code.
 * Covers the subset returned by Open-Meteo.
 */
export function weatherCodeToEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "🌤️";
  if (code <= 3) return "☁️";
  if (code <= 49) return "🌫️";
  if (code <= 59) return "🌦️";
  if (code <= 69) return "🌧️";
  if (code <= 79) return "🌨️";
  if (code <= 82) return "🌧️";
  if (code <= 84) return "🌨️";
  if (code <= 99) return "⛈️";
  return "🌡️";
}

/**
 * Formats a temperature value with degree symbol.
 */
export function formatTemp(temp: number): string {
  return `${Math.round(temp)}°`;
}

/**
 * Formats a date string "YYYY-MM-DD" to short display e.g. "Jun 11"
 */
export function formatForecastDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Geolocation ──────────────────────────────────────────────

/**
 * Promisified wrapper around the browser Geolocation API.
 * Rejects with a user-readable message on failure.
 */
export function getCurrentPosition(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: parseFloat(pos.coords.latitude.toFixed(4)),
          lon: parseFloat(pos.coords.longitude.toFixed(4)),
        });
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            reject(new Error("Location access denied. Using default location."));
            break;
          case err.POSITION_UNAVAILABLE:
            reject(new Error("Location unavailable."));
            break;
          case err.TIMEOUT:
            reject(new Error("Location request timed out."));
            break;
          default:
            reject(new Error("Could not retrieve location."));
        }
      },
      { timeout: 8000, maximumAge: 300_000 }
    );
  });
}

// Default fallback location — Kolkata
export const DEFAULT_LOCATION = { lat: 22.5726, lon: 88.3639 };

// ─── File validation ──────────────────────────────────────────

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 10;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): FileValidationResult {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPEG, PNG, and WebP images are supported.",
    };
  }
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_FILE_SIZE_MB) {
    return {
      valid: false,
      error: `Image must be under ${MAX_FILE_SIZE_MB}MB. Yours is ${sizeMB.toFixed(1)}MB.`,
    };
  }
  return { valid: true };
}

// ─── String utilities ─────────────────────────────────────────

/**
 * Truncates a string to maxLen characters with ellipsis.
 */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + "…";
}

/**
 * Capitalises the first letter of a string.
 */
export function capitalise(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}