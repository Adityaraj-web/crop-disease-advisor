import { useState, useCallback, useRef } from "react";
import { predictDisease } from "@/lib/api/predict";
import { fetchAdvisory } from "@/lib/api/advisory";
import type { PredictionResponse } from "@/types/disease";
import type { AdvisoryResponse } from "@/types/scan";

export type ScanState =
  | "idle"
  | "uploading"
  | "predicting"
  | "predicted"
  | "advising"
  | "complete"
  | "error";

const KOLKATA = { lat: 22.5726, lon: 88.3639 };

interface UseDetectionReturn {
  state: ScanState;
  previewUrl: string | null;
  prediction: PredictionResponse | null;
  advisory: AdvisoryResponse | null;
  errorMessage: string | null;
  advisoryRef: React.RefObject<HTMLDivElement | null>;
  handleFileSelect: (file: File) => Promise<void>;
  handleGetAdvisory: () => Promise<void>;
  resetScan: () => void;
}

export function useDetection(): UseDetectionReturn {
  const [state, setState] = useState<ScanState>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [advisory, setAdvisory] = useState<AdvisoryResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const advisoryRef = useRef<HTMLDivElement>(null);

  const resetScan = useCallback(() => {
    setState("idle");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPrediction(null);
    setAdvisory(null);
    setErrorMessage(null);
  }, [previewUrl]);

  const handleFileSelect = useCallback(async (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setState("uploading");

    await new Promise((r) => setTimeout(r, 300));

    setState("predicting");
    try {
      const result = await predictDisease(file);
      setPrediction(result);
      setState("predicted");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Prediction failed. Is the backend running?"
      );
      setState("error");
    }
  }, []);

  const handleGetAdvisory = useCallback(async () => {
    if (!prediction) return;

    setState("advising");

    let coords = KOLKATA;
    try {
      await new Promise<void>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
            resolve();
          },
          () => resolve(),
          { timeout: 4000 }
        );
      });
    } catch {
      // silent fallback to Kolkata
    }

    try {
      const result = await fetchAdvisory({
        disease_label: prediction.top1_label,
        confidence: prediction.top1_confidence,
        lat: coords.lat,
        lon: coords.lon,
      });
      setAdvisory(result);
      setState("complete");

      setTimeout(() => {
        advisoryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Advisory failed. Check if LLM is running."
      );
      setState("error");
    }
  }, [prediction]);

  return {
    state,
    previewUrl,
    prediction,
    advisory,
    errorMessage,
    advisoryRef,
    handleFileSelect,
    handleGetAdvisory,
    resetScan,
  };
}