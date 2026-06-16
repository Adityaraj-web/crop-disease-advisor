"use client";

import type { PredictionResponse } from "@/types/disease";
import type { AdvisoryResponse } from "@/types/scan";

interface DetectionResultProps {
  prediction: PredictionResponse;
  advisory: AdvisoryResponse | null;
  onGetAdvisory: () => void;
  isAdvising: boolean;
  advisoryComplete: boolean;
}

function ConfidenceArc({ value }: { value: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = circ * value;
  const color = value >= 0.75 ? "#4ade80" : value >= 0.5 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ position: "relative", width: "120px", height: "120px", flexShrink: 0 }}>
      <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="arcGradDR" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="url(#arcGradDR)" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${filled} ${circ - filled}`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span className="font-mono-data" style={{ fontSize: "34px", fontWeight: 700, color, lineHeight: 1 }}>
          {Math.round(value * 100)}<span style={{ fontSize: "15px" }}>%</span>
        </span>
        <span className="label-instrument" style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", marginTop: "4px", letterSpacing: "0.12em" }}>
          CONFIDENCE
        </span>
      </div>
    </div>
  );
}

function parseLabel(label: string): { crop: string; disease: string } {
  const parts = label.split(":");
  if (parts.length === 2) return { crop: parts[0].trim(), disease: parts[1].trim() };
  return { crop: "", disease: label };
}

function confidenceColor(value: number): string {
  if (value >= 0.75) return "#4ade80";
  if (value >= 0.5) return "#f59e0b";
  return "#ef4444";
}

export function DetectionResult({ prediction, advisory, onGetAdvisory, isAdvising, advisoryComplete }: DetectionResultProps) {
  const { crop, disease } = parseLabel(prediction.top1_label);
  const weather = advisory?.weather?.current ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* Disease + confidence */}
      <div style={{ borderRadius: "16px", padding: "20px", backgroundColor: "#0f1a0f", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <span style={{ height: "8px", width: "8px", borderRadius: "50%", backgroundColor: "#f59e0b", boxShadow: "0 0 6px #f59e0b", flexShrink: 0 }} />
          <span className="label-instrument" style={{ color: "rgba(255,255,255,0.45)" }}>Probable Match</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 className="font-bold" style={{ fontSize: "30px", color: "#ffffff", lineHeight: 1.1, marginBottom: "6px" }}>
              {disease}
            </h2>
            {prediction.is_healthy ? (
              <p style={{ fontSize: "13px", color: "#4ade80" }}>No disease detected</p>
            ) : (
              <p style={{ fontSize: "13px" }}>
                <span style={{ color: "#f59e0b" }}>{crop}</span>
                <span style={{ color: "rgba(255,255,255,0.45)" }}> · Disease detected</span>
              </p>
            )}
          </div>
          <ConfidenceArc value={prediction.top1_confidence} />
        </div>
      </div>

      {/* Top predictions */}
      <div style={{ borderRadius: "16px", padding: "20px", backgroundColor: "#0f1a0f", border: "1px solid rgba(255,255,255,0.08)" }}>
        <p className="label-instrument" style={{ color: "rgba(255,255,255,0.4)", marginBottom: "14px" }}>Top Predictions</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
          {prediction.top3.map((item, i) => {
            const { disease: d } = parseLabel(item.label);
            const col = confidenceColor(item.confidence);
            const borderColor = i === 0 ? "#4ade80" : i === 1 ? "#f59e0b" : "#ef4444";
            return (
              <div
                key={i}
                style={{
                  borderRadius: "10px",
                  padding: "14px 12px",
                  backgroundColor: i === 0 ? "rgba(22,101,52,0.15)" : "#162116",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderLeft: `3px solid ${borderColor}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span className="font-mono-data" style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>0{i + 1}</span>
                  <span className="font-mono-data" style={{ fontSize: "13px", fontWeight: 700, color: col }}>{Math.round(item.confidence * 100)}%</span>
                </div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff", lineHeight: 1.3 }}>{d}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Field conditions */}
      {weather && (
        <div style={{ borderRadius: "16px", padding: "20px", backgroundColor: "#0f1a0f", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="label-instrument" style={{ color: "rgba(255,255,255,0.4)", marginBottom: "14px" }}>Field Conditions</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "8px" }}>
            {[
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0Z"/></svg>, value: weather.temperature, unit: "°C", label: "Temperature" },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z"/></svg>, value: weather.humidity, unit: "%", label: "Humidity" },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>, value: weather.wind_speed, unit: "km/h", label: "Wind" },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>, value: weather.precipitation, unit: "mm", label: "Precipitation" },
            ].map((tile) => (
              <div key={tile.label} style={{ borderRadius: "12px", padding: "14px", backgroundColor: "#162116", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ marginBottom: "8px" }}>{tile.icon}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
                  <span className="font-mono-data" style={{ fontSize: "22px", fontWeight: 700, color: "#ffffff" }}>{tile.value}</span>
                  <span className="font-mono-data" style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{tile.unit}</span>
                </div>
                <p className="label-instrument" style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>{tile.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      {!advisoryComplete && !prediction.is_healthy && (
        <button
          onClick={onGetAdvisory}
          disabled={isAdvising}
          style={{ width: "100%", borderRadius: "12px", padding: "14px", backgroundColor: "#166534", color: "#4ade80", fontSize: "14px", fontWeight: 600, opacity: isAdvising ? 0.6 : 1, cursor: isAdvising ? "not-allowed" : "pointer", transition: "opacity 0.2s", border: "none" }}
        >
          {isAdvising ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <span className="animate-spin" style={{ display: "inline-block", width: "16px", height: "16px", borderRadius: "50%", border: "2px solid rgba(74,222,128,0.3)", borderTopColor: "#4ade80" }} />
              Generating advisory…
            </span>
          ) : "Get Treatment Advisory →"}
        </button>
      )}

      {prediction.is_healthy && (
        <div style={{ borderRadius: "12px", padding: "16px", textAlign: "center", backgroundColor: "rgba(22,101,52,0.15)", border: "1px solid rgba(74,222,128,0.2)" }}>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "#4ade80" }}>✓ Crop appears healthy — no treatment needed</p>
        </div>
      )}
    </div>
  );
}