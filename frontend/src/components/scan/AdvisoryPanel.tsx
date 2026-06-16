"use client";

import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import type { AdvisoryResponse } from "@/types/scan";

// ─── Language config ──────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi",   native: "हिन्दी"  },
  { code: "bn", label: "Bengali", native: "বাংলা"   },
  { code: "te", label: "Telugu",  native: "తెలుగు"  },
  { code: "ta", label: "Tamil",   native: "தமிழ்"   },
] as const;

type LangCode = (typeof LANGUAGES)[number]["code"];

// ─── Props ────────────────────────────────────────────────────────────────────
interface AdvisoryPanelProps {
  data: AdvisoryResponse;
  onRequestTranslation: (lang: string) => Promise<string>;
}

// ─── Markdown parser (your original) ─────────────────────────────────────────
function parseAdvisoryText(text: string): Array<{ type: "heading" | "paragraph" | "bullet"; content: string }> {
  const blocks: Array<{ type: "heading" | "paragraph" | "bullet"; content: string }> = [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    if (/^\d+\.\s+\*\*/.test(line) || /^\*\*[^*]+\*\*$/.test(line)) {
      const clean = line.replace(/^\d+\.\s+/, "").replace(/\*\*/g, "").replace(/:$/, "");
      blocks.push({ type: "heading", content: clean });
    } else if (/^[•\-\*]\s+/.test(line)) {
      const clean = line.replace(/^[•\-\*]\s+/, "").replace(/\*\*/g, "");
      blocks.push({ type: "bullet", content: clean });
    } else {
      const clean = line.replace(/\*\*/g, "");
      blocks.push({ type: "paragraph", content: clean });
    }
  }
  return blocks;
}

// ─── Inline bold renderer (your original) ────────────────────────────────────
function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: "#ffffff", fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ─── Spread risk (your original) ─────────────────────────────────────────────
function spreadRiskLevel(text: string): "HIGH" | "MEDIUM" | "LOW" {
  const lower = text.toLowerCase();
  if (lower.includes("high risk") || lower.includes("high spread")) return "HIGH";
  if (lower.includes("medium risk") || lower.includes("moderate")) return "MEDIUM";
  return "LOW";
}

const riskColor  = { HIGH: "#ef4444",                  MEDIUM: "#f59e0b",                  LOW: "#4ade80"                  };
const riskBg     = { HIGH: "rgba(239,68,68,0.08)",      MEDIUM: "rgba(245,158,11,0.08)",     LOW: "rgba(74,222,128,0.08)"    };
const riskBorder = { HIGH: "rgba(239,68,68,0.25)",      MEDIUM: "rgba(245,158,11,0.25)",     LOW: "rgba(74,222,128,0.25)"    };

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdvisoryPanel({ data, onRequestTranslation }: AdvisoryPanelProps) {
  // Cache: pre-fill English from initial response
  const [cache, setCache] = useState<Partial<Record<LangCode, string>>>({
    en: data.advisory_text,
  });
  const [activeLang, setActiveLang]     = useState<LangCode>("en");
  const [translating, setTranslating]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeLanguage  = LANGUAGES.find((l) => l.code === activeLang)!;
  const displayedText   = cache[activeLang] ?? data.advisory_text;

  const handleLanguageSelect = useCallback(
    async (code: LangCode) => {
      setDropdownOpen(false);
      if (code === activeLang) return;

      // Instant switch for cached languages
      if (cache[code] || code === "en") {
        setActiveLang(code);
        return;
      }

      // Fetch translation
      setTranslating(true);
      setActiveLang(code);
      try {
        const translated = await onRequestTranslation(code);
        setCache((prev) => ({ ...prev, [code]: translated }));
      } catch {
        setActiveLang("en"); // silent fallback
      } finally {
        setTranslating(false);
      }
    },
    [activeLang, cache, onRequestTranslation]
  );

  const blocks   = parseAdvisoryText(displayedText);
  const risk     = spreadRiskLevel(data.advisory_text); // always derive risk from English
  const forecast = data.weather?.forecast ?? [];
  const current  = data.weather?.current;
  const location = data.weather?.location;

  return (
    <>
      <style>{`
        .lang-dropdown-wrapper { position: relative; display: inline-block; }
        .lang-trigger {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 8px;
          background: #162116; border: 1px solid rgba(74,222,128,0.15);
          color: rgba(255,255,255,0.75); font-size: 12px;
          font-family: inherit; cursor: pointer;
          transition: border-color 0.15s; white-space: nowrap;
        }
        .lang-trigger:hover  { border-color: rgba(74,222,128,0.35); }
        .lang-trigger:disabled { opacity: 0.5; cursor: not-allowed; }
        .lang-chevron { transition: transform 0.15s; color: rgba(255,255,255,0.4); flex-shrink: 0; }
        .lang-chevron.open { transform: rotate(180deg); }
        .lang-menu {
          position: absolute; top: calc(100% + 6px); right: 0;
          min-width: 160px; background: #162116;
          border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
          padding: 4px; z-index: 50; box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        .lang-option {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 8px 12px; border-radius: 7px;
          border: none; background: none; cursor: pointer;
          font-family: inherit; font-size: 13px;
          color: rgba(255,255,255,0.7);
          transition: background 0.1s, color 0.1s; text-align: left;
        }
        .lang-option:hover { background: rgba(255,255,255,0.06); color: #ffffff; }
        .lang-option.active { color: #4ade80; background: rgba(74,222,128,0.08); }
        .lang-option-native { font-size: 12px; color: rgba(255,255,255,0.35); }
        .lang-option.active .lang-option-native { color: rgba(74,222,128,0.6); }
        .advisory-grid {
          display: grid;
          grid-template-columns: 1fr 280px;
          background: #0a0f0a;
        }
        @media (max-width: 767px) {
          .advisory-grid { grid-template-columns: 1fr; }
          .advisory-sidebar { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.06); }
          .lang-menu { right: auto; left: 0; }
        }
      `}</style>

      <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>

        {/* ── Header bar ── */}
        <div style={{
          backgroundColor: "#0f1a0f",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "16px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, flexWrap: "wrap",
        }}>
          {/* Left: labels + risk badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div>
              <p className="label-instrument" style={{ color: "#4ade80", marginBottom: "2px" }}>Treatment Advisory</p>
              <p className="label-instrument" style={{ color: "rgba(255,255,255,0.35)" }}>Treatment Protocol</p>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "6px 14px", borderRadius: "999px",
              backgroundColor: riskBg[risk], border: `1px solid ${riskBorder[risk]}`,
            }}>
              <span style={{
                height: "7px", width: "7px", borderRadius: "50%",
                backgroundColor: riskColor[risk],
                boxShadow: `0 0 6px ${riskColor[risk]}`, flexShrink: 0,
              }} />
              <span className="font-mono-data" style={{ fontSize: "12px", fontWeight: 700, color: riskColor[risk] }}>
                {risk} RISK
              </span>
            </div>
          </div>

          {/* Right: language dropdown */}
          <div className="lang-dropdown-wrapper">
            <button
              className="lang-trigger"
              onClick={() => setDropdownOpen((o) => !o)}
              disabled={translating}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              {translating ? (
                <span style={{ color: "rgba(255,255,255,0.45)" }}>Translating…</span>
              ) : (
                <>
                  <span>{activeLanguage.native}</span>
                  {activeLang !== "en" && (
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                      · {activeLanguage.label}
                    </span>
                  )}
                </>
              )}
              <ChevronDown size={13} className={`lang-chevron${dropdownOpen ? " open" : ""}`} />
            </button>

            {dropdownOpen && (
              <>
                <div
                  style={{ position: "fixed", inset: 0, zIndex: 49 }}
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="lang-menu" role="listbox">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      role="option"
                      aria-selected={activeLang === lang.code}
                      className={`lang-option${activeLang === lang.code ? " active" : ""}`}
                      onClick={() => handleLanguageSelect(lang.code)}
                    >
                      <span>{lang.label}</span>
                      <span className="lang-option-native">{lang.native}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Body: two columns ── */}
        <div className="advisory-grid">

          {/* Left — advisory text */}
          <div style={{ padding: "28px 32px", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
            {translating ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[90, 75, 85, 60, 80, 70, 88].map((w, i) => (
                  <div key={i} className="skeleton" style={{ height: 13, width: `${w}%`, borderRadius: 4 }} />
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
                {blocks.map((block, i) => {
                  if (block.type === "heading") {
                    return (
                      <h3 key={i} style={{
                        fontSize: "13px", fontWeight: 700, color: "#4ade80",
                        marginTop: i === 0 ? "0" : "20px", marginBottom: "8px",
                        textTransform: "uppercase", letterSpacing: "0.05em",
                      }}>
                        {block.content}
                      </h3>
                    );
                  }
                  if (block.type === "bullet") {
                    return (
                      <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                        <span style={{ color: "#4ade80", marginTop: "3px", flexShrink: 0, fontSize: "12px" }}>•</span>
                        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                          {renderInline(block.content)}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <p key={i} style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "8px" }}>
                      {renderInline(block.content)}
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right — weather sidebar */}
          <div className="advisory-sidebar" style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Current conditions */}
            {current && (
              <div>
                <p className="label-instrument" style={{ color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>Field Conditions</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "6px" }}>
                  {[
                    { icon: "🌡", value: current.temperature, unit: "°C",   label: "Temp"   },
                    { icon: "💧", value: current.humidity,    unit: "%",    label: "Humid"  },
                    { icon: "💨", value: current.wind_speed,  unit: "km/h", label: "Wind"   },
                    { icon: "🌧", value: current.precipitation, unit: "mm", label: "Precip" },
                  ].map((tile) => (
                    <div key={tile.label} style={{
                      borderRadius: "10px", padding: "10px",
                      backgroundColor: "#0f1a0f",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <div style={{ fontSize: "14px", marginBottom: "4px" }}>{tile.icon}</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "1px" }}>
                        <span className="font-mono-data" style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff" }}>{tile.value}</span>
                        <span className="font-mono-data" style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>{tile.unit}</span>
                      </div>
                      <p className="label-instrument" style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{tile.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3-day forecast */}
            {forecast.length > 0 && (
              <div>
                <p className="label-instrument" style={{ color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>3-Day Forecast</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {forecast.slice(0, 3).map((day, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 12px", borderRadius: "10px",
                      backgroundColor: "#0f1a0f", border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <span className="font-mono-data" style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", minWidth: "44px" }}>
                        {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <span style={{ fontSize: "14px" }}>
                        {day.weather_code >= 95 ? "⛈" : day.weather_code >= 80 ? "🌧" : day.weather_code >= 51 ? "🌦" : day.weather_code >= 3 ? "⛅" : "☀️"}
                      </span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{day.description}</span>
                      <span className="font-mono-data" style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>
                        {Math.round(day.temp_max)}° / {Math.round(day.temp_min)}°
                      </span>
                      <span className="font-mono-data" style={{ fontSize: "11px", color: "#4ade80" }}>
                        {day.precipitation_sum}mm
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coordinates */}
            {location && (
              <p className="font-mono-data" style={{
                fontSize: "10px", color: "rgba(255,255,255,0.2)",
                textAlign: "right", marginTop: "auto",
              }}>
                {location.lat.toFixed(2)}°N {location.lon.toFixed(2)}°E
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}