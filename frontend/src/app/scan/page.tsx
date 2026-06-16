"use client";

import { useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { ImageUploader } from "@/components/scan/ImageUploader";
import { DetectionResult } from "@/components/scan/DetectionResult";
import AdvisoryPanel from "@/components/scan/AdvisoryPanel";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { useDetection } from "@/hooks/useDetection";
import { useAuth } from "@/hooks/useAuth";

export default function ScanPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    state,
    previewUrl,
    prediction,
    advisory,
    errorMessage,
    advisoryRef,
    handleFileSelect,
    handleGetAdvisory,
    resetScan,
  } = useDetection();

  // ── Translation wiring ────────────────────────────────────────────────────
  // Stores the params from the most recent completed scan so the translation
  // callback can re-call /api/advisory with a different target_lang.
  const lastScanParamsRef = useRef<{
    disease_label: string;
    confidence: number;
    lat: number;
    lon: number;
  } | null>(null);

  // Populate the ref whenever a scan completes and advisory is available.
  // advisory comes from useDetection — when it's non-null, prediction is also
  // non-null and the location was already used to fetch it.
  if (advisory && prediction && !lastScanParamsRef.current) {
    lastScanParamsRef.current = {
      disease_label: advisory.disease_label,
      confidence: advisory.confidence,
      // advisory.weather.location has the resolved lat/lon (fallback-included)
      lat: advisory.weather?.location?.lat ?? 22.5726,
      lon: advisory.weather?.location?.lon ?? 88.3639,
    };
  }

  // Clear the ref when the user resets so a new scan gets fresh params
  const handleReset = useCallback(() => {
    lastScanParamsRef.current = null;
    resetScan();
  }, [resetScan]);

  // Called by AdvisoryPanel when the user picks a non-English language.
  // Fires /api/advisory with the same params but a different target_lang.
  // Returns only the translated advisory_text string — panel handles caching.
  const handleRequestTranslation = useCallback(
    async (lang: string): Promise<string> => {
      const params = lastScanParamsRef.current;
      if (!params) return "";

      const response = await fetch("/api/advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disease_label: params.disease_label,
          confidence: params.confidence,
          lat: params.lat,
          lon: params.lon,
          target_lang: lang,
        }),
      });

      if (!response.ok) throw new Error("Translation request failed");
      const data = await response.json();
      return data.advisory_text ?? "";
    },
    [] // no deps — reads ref directly, never stale
  );
  // ── End translation wiring ────────────────────────────────────────────────

  const isLoading = state === "uploading" || state === "predicting";
  const showResult = state === "predicted" || state === "advising" || state === "complete";
  const showAdvisory = state === "complete" && advisory !== null;
  const isGated = !authLoading && !user;

  return (
    <ErrorBoundary>
      <style>{`
        .scan-main {
          max-width: 1440px;
          margin: 0 auto;
          padding: 72px 40px 96px 40px;
        }
        .scan-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 1023px) {
          .scan-main { padding: 72px 20px 80px 20px; }
          .scan-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 639px) {
          .scan-main { padding: 68px 16px 64px 16px; }
        }
      `}</style>

      <div className="min-h-screen" style={{ backgroundColor: "#0a0f0a" }}>
        <div className="top-accent-bar" />
        <Navbar />

        <main className="scan-main">
          {/* Page header */}
          <div style={{ marginBottom: "20px", paddingTop: "16px" }}>
            <p className="label-instrument" style={{ color: "#4ade80", marginBottom: "6px" }}>
              Diagnostic Engine
            </p>
            <h1 className="font-bold" style={{
              color: "#ffffff", fontSize: "36px",
              lineHeight: 1.1, marginBottom: "8px",
            }}>
              Scan a Leaf
            </h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px" }}>
              Upload a clear photo of a single leaf. The model identifies the disease;
              the advisor generates a treatment protocol.
            </p>
          </div>

          {/* Gate overlay + scan UI wrapper */}
          <div style={{ position: "relative" }}>

            {/* Soft gate — shown when not logged in */}
            <AnimatePresence>
              {isGated && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 10,
                    borderRadius: "16px",
                    backdropFilter: "blur(6px)",
                    backgroundColor: "rgba(10,15,10,0.75)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "20px",
                    padding: "40px 24px",
                    textAlign: "center",
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: "56px", height: "56px",
                    background: "rgba(22,101,52,0.3)",
                    border: "1px solid rgba(74,222,128,0.2)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <LogIn size={24} color="#4ade80" />
                  </div>

                  {/* Text */}
                  <div>
                    <h2 className="font-display" style={{
                      fontSize: "22px", fontWeight: 700,
                      color: "#ffffff", margin: "0 0 10px",
                    }}>
                      Sign in to scan
                    </h2>
                    <p style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: "14px", lineHeight: 1.6,
                      margin: 0, maxWidth: "320px",
                    }}>
                      Create a free account to diagnose crop diseases and save
                      your scan history.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                    <Link
                      href="/login"
                      style={{
                        padding: "10px 28px",
                        background: "#166534",
                        border: "1px solid rgba(74,222,128,0.2)",
                        borderRadius: "8px",
                        color: "#4ade80",
                        fontSize: "14px", fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/signup"
                      style={{
                        padding: "10px 28px",
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "8px",
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "14px", fontWeight: 500,
                        textDecoration: "none",
                      }}
                    >
                      Create account
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scan UI — always rendered, blurred behind gate when logged out */}
            <div style={{
              filter: isGated ? "blur(2px)" : "none",
              pointerEvents: isGated ? "none" : "auto",
              transition: "filter 0.25s",
            }}>
              <div className="scan-grid">
                {/* Left — uploader */}
                <ImageUploader
                  onFileSelect={handleFileSelect}
                  previewUrl={previewUrl}
                  isLoading={isLoading}
                  currentState={state}
                  onReset={handleReset}
                />

                {/* Right — result or placeholder */}
                <AnimatePresence mode="wait">
                  {showResult && prediction ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <DetectionResult
                        prediction={prediction}
                        advisory={advisory}
                        onGetAdvisory={handleGetAdvisory}
                        isAdvising={state === "advising"}
                        advisoryComplete={state === "complete"}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        minHeight: "360px",
                        backgroundColor: "#0f1a0f",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px",
                        padding: "24px",
                        display: "flex", flexDirection: "column", gap: "16px",
                      }}
                    >
                      <p className="label-instrument" style={{ color: "rgba(74,222,128,0.5)" }}>
                        Awaiting Image
                      </p>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                        {[140, 90, 110].map((w, i) => (
                          <div key={i} className="skeleton" style={{ height: "16px", width: `${w}px`, borderRadius: "4px" }} />
                        ))}
                      </div>
                      <div style={{
                        backgroundColor: "#162116",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "12px", padding: "16px", marginTop: "auto",
                      }}>
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
                          Drop an image on the left to begin diagnosis. Results appear here.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Error banner */}
              <AnimatePresence>
                {state === "error" && errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      marginTop: "20px", borderRadius: "12px", padding: "20px",
                      backgroundColor: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.25)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <span style={{
                        height: "8px", width: "8px", borderRadius: "50%",
                        backgroundColor: "#ef4444", flexShrink: 0, marginTop: "6px",
                      }} />
                      <div>
                        <p style={{ color: "#ef4444", fontSize: "14px", fontWeight: 500, marginBottom: "4px" }}>
                          Something went wrong
                        </p>
                        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px" }}>
                          {errorMessage}
                        </p>
                        <button
                          onClick={handleReset}
                          style={{
                            color: "#4ade80", fontSize: "12px", marginTop: "12px",
                            textDecoration: "underline", textUnderlineOffset: "2px",
                            background: "none", border: "none", cursor: "pointer",
                          }}
                        >
                          Start over
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Advisory panel — outside gate, only shown when complete */}
          <AnimatePresence>
            {showAdvisory && advisory && (
              <motion.div
                ref={advisoryRef}
                key="advisory"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                style={{ marginTop: "24px" }}
              >
                <AdvisoryPanel
                  data={advisory}
                  onRequestTranslation={handleRequestTranslation}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </ErrorBoundary>
  );
}