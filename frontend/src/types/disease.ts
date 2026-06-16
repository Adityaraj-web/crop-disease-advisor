// Matches the backend /predict response contract exactly

export interface PredictionLabel {
  label: string;      // e.g. "Tomato: Late blight"
  index: number;      // class index 0–37
  confidence: number; // 0.0 – 1.0
}

export interface PredictionResponse {
  top3: PredictionLabel[];
  top1_label: string;
  top1_confidence: number;
  is_healthy: boolean;
}

// Parsed from top1_label — "Crop: Disease" format
export interface ParsedDisease {
  crop: string;       // e.g. "Tomato"
  disease: string;    // e.g. "Late blight"
  fullLabel: string;  // original label unchanged
  isHealthy: boolean;
}

// Confidence tier — drives arc color and badge variant
export type ConfidenceTier = "high" | "medium" | "low";

export function getConfidenceTier(confidence: number): ConfidenceTier {
  if (confidence >= 0.75) return "high";
  if (confidence >= 0.50) return "medium";
  return "low";
}

// Arc color per tier — maps to CSS variables
export function getArcColor(tier: ConfidenceTier): string {
  switch (tier) {
    case "high":   return "#22c55e";  // --green-muted
    case "medium": return "#f59e0b";  // --amber-accent
    case "low":    return "#ef4444";  // --red-accent
  }
}

// Parse "Crop: Disease" label into structured parts
export function parseLabel(label: string, isHealthy: boolean): ParsedDisease {
  const parts = label.split(":");
  if (parts.length < 2) {
    return {
      crop: label,
      disease: isHealthy ? "Healthy" : "Unknown",
      fullLabel: label,
      isHealthy,
    };
  }
  return {
    crop: parts[0].trim(),
    disease: parts[1].trim(),
    fullLabel: label,
    isHealthy,
  };
}

// All 38 PlantVillage class labels — used in the landing page ticker
export const DISEASE_LABELS: string[] = [
  "Apple: Apple scab",
  "Apple: Black rot",
  "Apple: Cedar apple rust",
  "Apple: Healthy",
  "Blueberry: Healthy",
  "Cherry: Powdery mildew",
  "Cherry: Healthy",
  "Corn: Cercospora leaf spot",
  "Corn: Common rust",
  "Corn: Northern leaf blight",
  "Corn: Healthy",
  "Grape: Black rot",
  "Grape: Esca (Black measles)",
  "Grape: Leaf blight (Isariopsis)",
  "Grape: Healthy",
  "Orange: Haunglongbing (Citrus greening)",
  "Peach: Bacterial spot",
  "Peach: Healthy",
  "Pepper: Bacterial spot",
  "Pepper: Healthy",
  "Potato: Early blight",
  "Potato: Late blight",
  "Potato: Healthy",
  "Raspberry: Healthy",
  "Soybean: Healthy",
  "Squash: Powdery mildew",
  "Strawberry: Leaf scorch",
  "Strawberry: Healthy",
  "Tomato: Bacterial spot",
  "Tomato: Early blight",
  "Tomato: Late blight",
  "Tomato: Leaf mold",
  "Tomato: Septoria leaf spot",
  "Tomato: Spider mites",
  "Tomato: Target spot",
  "Tomato: Tomato yellow leaf curl virus",
  "Tomato: Tomato mosaic virus",
  "Tomato: Healthy",
];