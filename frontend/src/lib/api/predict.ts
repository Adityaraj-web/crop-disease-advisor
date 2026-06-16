import type { PredictionResponse } from "@/types/disease";

// All errors from the predict API are typed
export class PredictError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "PredictError";
  }
}

/**
 * Sends a leaf image to the Next.js proxy route /api/predict,
 * which forwards it to FastAPI POST /predict as multipart/form-data.
 *
 * @param file  The image File object from the upload zone
 * @returns     Typed PredictionResponse matching backend contract
 */
export async function predictDisease(
  file: File
): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("file", file);

  let response: Response;

  try {
    response = await fetch("/api/predict", {
      method: "POST",
      body: formData,
      // Do not set Content-Type header — browser sets it automatically
      // with the correct multipart boundary when body is FormData
    });
  } catch {
    throw new PredictError(
      "Could not reach the prediction service. Is the backend running?"
    );
  }

  if (!response.ok) {
    let message = `Prediction failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.detail) message = body.detail;
    } catch {
      // response body not JSON — use default message
    }
    throw new PredictError(message, response.status);
  }

  const data: PredictionResponse = await response.json();
  return data;
}