"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// ─── Types ────────────────────────────────────────────────────────────────────
interface OutbreakReport {
  id: string;
  disease_label: string;
  lat: number;
  lon: number;
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Parse "Tomato: Late blight" → { crop: "Tomato", disease: "Late blight" }
function parseLabel(label: string): { crop: string; disease: string } {
  const parts = label.split(":");
  if (parts.length === 2) {
    return { crop: parts[0].trim(), disease: parts[1].trim() };
  }
  return { crop: label, disease: "" };
}

// Healthy labels from PlantVillage contain the word "healthy"
function isHealthy(label: string) {
  return label.toLowerCase().includes("healthy");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Color markers: red for disease, green for healthy
function markerColor(label: string) {
  return isHealthy(label) ? "#4ade80" : "#ef4444";
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function OutbreakMap() {
  const [reports, setReports] = useState<OutbreakReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetch("/api/map-data");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setReports(json.reports ?? []);
      } catch {
        setError("Could not load outbreak data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const diseaseCount = reports.filter((r) => !isHealthy(r.disease_label)).length;
  const healthyCount = reports.filter((r) => isHealthy(r.disease_label)).length;

  if (loading) {
    return (
      <div style={styles.placeholder}>
        <div style={styles.placeholderInner}>
          <div className="skeleton" style={{ width: "100%", height: "100%", borderRadius: 12 }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.placeholder}>
        <p style={{ color: "#ef4444", fontSize: 14 }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* Legend */}
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <span style={{ ...styles.legendDot, background: "#ef4444" }} />
          <span style={styles.legendLabel}>
            Disease ({diseaseCount} {diseaseCount === 1 ? "report" : "reports"})
          </span>
        </div>
        <div style={styles.legendItem}>
          <span style={{ ...styles.legendDot, background: "#4ade80" }} />
          <span style={styles.legendLabel}>
            Healthy ({healthyCount} {healthyCount === 1 ? "report" : "reports"})
          </span>
        </div>
      </div>

      {/* Map */}
      <div style={styles.mapContainer}>
        <MapContainer
          center={[20.5937, 78.9629]} // India center
          zoom={5}
          style={{ width: "100%", height: "100%", borderRadius: 12 }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {reports.map((report) => {
            const { crop, disease } = parseLabel(report.disease_label);
            const color = markerColor(report.disease_label);
            return (
              <CircleMarker
                key={report.id}
                center={[report.lat, report.lon]}
                radius={7}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.75,
                  weight: 1.5,
                }}
              >
                <Popup>
                  <div style={styles.popup}>
                    <div style={styles.popupCrop}>{crop}</div>
                    {disease && (
                      <div style={styles.popupDisease}>{disease}</div>
                    )}
                    <div style={styles.popupDate}>{formatDate(report.created_at)}</div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  legend: {
    display: "flex",
    gap: 20,
    alignItems: "center",
    padding: "10px 16px",
    background: "#0f1a0f",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    width: "fit-content",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
  },
  legendLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    fontFamily: "var(--font-geist-mono, monospace)",
  },
  mapContainer: {
    height: 480,
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  placeholder: {
    height: 480,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f1a0f",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  placeholderInner: {
    width: "100%",
    height: "100%",
  },
  popup: {
    fontFamily: "Inter, sans-serif",
    minWidth: 120,
  },
  popupCrop: {
    fontWeight: 600,
    fontSize: 13,
    color: "#1a1a1a",
    marginBottom: 2,
  },
  popupDisease: {
    fontSize: 12,
    color: "#c2410c",
    marginBottom: 4,
  },
  popupDate: {
    fontSize: 11,
    color: "#666",
  },
};