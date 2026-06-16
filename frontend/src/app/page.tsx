import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0f0a" }}>
      <style>{`
        .hero-container {
          max-width: 1440px;
          margin: 0 auto;
          width: 100%;
          padding: 80px 48px 0 48px;
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 80px;
          align-items: center;
        }
        .phone-mockup-col {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .features-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 80px 48px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 1023px) {
          .hero-container {
            grid-template-columns: 1fr;
            padding: 100px 24px 48px 24px;
            gap: 40px;
          }
          .phone-mockup-col {
            display: none;
          }
          .features-container {
            padding: 48px 24px;
          }
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .hero-container {
            padding: 100px 40px 48px 40px;
          }
          .features-container {
            padding: 64px 40px;
          }
        }
        .hero-headline {
          font-size: clamp(36px, 4.2vw, 72px);
          white-space: nowrap;
        }
        @media (max-width: 640px) {
          .hero-headline {
            white-space: normal;
            font-size: clamp(32px, 8vw, 48px);
          }
        }
      `}</style>

      <div className="top-accent-bar" />
      <Navbar />

      {/* ── Hero ── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          backgroundImage: `
            radial-gradient(ellipse 60% 50% at 65% 50%, rgba(34,197,94,0.07) 0%, transparent 70%),
            linear-gradient(rgba(74,222,128,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "auto, 48px 48px, 48px 48px",
        }}
      >
        <div className="hero-container">

          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "560px" }}>
            <p className="label-instrument" style={{ color: "#4ade80" }}>
              AI-Powered Plant Diagnostics
            </p>

            <h1
              className="font-display hero-headline"
              style={{
                lineHeight: 1.05,
                color: "#ffffff",
                margin: 0,
              }}
            >
              Identify crop{" "}
              <span
                style={{
                  textDecorationLine: "underline",
                  textDecorationStyle: "wavy",
                  textDecorationColor: "#f59e0b",
                  textDecorationThickness: "2px",
                  textUnderlineOffset: "6px",
                }}
              >
                disease
              </span>
              .<br />
              Act before it spreads.
            </h1>

            <p style={{ fontSize: "18px", lineHeight: 1.7, color: "rgba(255,255,255,0.55)", maxWidth: "500px", margin: 0 }}>
              Upload a leaf photo. Get an instant diagnosis with treatment
              protocols and weather-based spread risk — powered by local AI.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
              <Link
                href="/scan"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "13px 26px", borderRadius: "15px",
                  backgroundColor: "lightgreen", color: "black",
                  fontSize: "14px", fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Scan a Leaf →
              </Link>
              <button
                style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "12px 22px", borderRadius: "15px",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.65)",
                  fontSize: "14px", fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                See how it works
              </button>
            </div>
          </div>

          {/* Right — Phone Mockup */}
          <div className="phone-mockup-col">
            <div
              style={{
                width: "100%",
                maxWidth: "300px",
                height: "430px",
                borderRadius: "44px",
                padding: "8px",
                backgroundColor: "#050805",
                border: "4px solid rgba(255,255,255,0.04)",
                outline: "1px solid rgba(74,222,128,0.15)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute", top: "14px", left: "50%",
                  transform: "translateX(-50%)", width: "100px", height: "20px",
                  backgroundColor: "#000000", borderRadius: "20px", zIndex: 20,
                  border: "1px solid rgba(255,255,255,0.03)",
                }}
              />

              <div
                className="animate-float"
                style={{
                  flex: 1, borderRadius: "36px",
                  padding: "36px 20px 24px 20px",
                  backgroundColor: "#0f1a0f",
                  border: "1px solid rgba(74,222,128,0.22)",
                  boxShadow: "inset 0 0 40px rgba(0,0,0,0.6), 0 0 40px rgba(34,197,94,0.04)",
                  display: "flex", flexDirection: "column",
                  justifyContent: "space-between", gap: "14px",
                  position: "relative", overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 0, left: "32px", right: "32px", height: "1px", backgroundColor: "rgba(74,222,128,0.4)" }} />

                <p className="label-instrument" style={{ color: "#4ade80", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Diagnosis</p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "24px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", letterSpacing: "-0.02em" }}>Late Blight</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", margin: 0 }}>Phytophthora infestans</p>
                  </div>
                  <div style={{ position: "relative", width: "64px", height: "64px", flexShrink: 0 }}>
                    <svg viewBox="0 0 64 64" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                      <defs>
                        <linearGradient id="heroArc" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#22c55e" />
                          <stop offset="100%" stopColor="#4ade80" />
                        </linearGradient>
                      </defs>
                      <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4.5" />
                      <circle cx="32" cy="32" r="26" fill="none" stroke="url(#heroArc)" strokeWidth="4.5" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 26 * 0.92} ${2 * Math.PI * 26 * 0.08}`} />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span className="font-mono-data" style={{ fontSize: "16px", fontWeight: 800, color: "#4ade80", lineHeight: 1 }}>92%</span>
                      <span className="label-instrument" style={{ fontSize: "7px", color: "rgba(255,255,255,0.4)", marginTop: "1px" }}>CONF.</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", backgroundColor: "#162116", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "6px", backgroundColor: "#166534", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#ffffff" }}>tomato_leaf.jpg</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>Analyzed locally</p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "12px", backgroundColor: "rgba(146,64,14,0.15)", border: "1px solid rgba(146,64,14,0.3)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                      <path d="M11 13v-2l-2 4h4l-2 4"/>
                    </svg>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>Spread Risk</span>
                  </div>
                  <span className="font-mono-data" style={{ fontSize: "12px", fontWeight: 700, color: "#f59e0b" }}>HIGH</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "7px", paddingTop: "6px", marginTop: "auto" }}>
                  <div className="skeleton" style={{ height: "4px", borderRadius: "999px", width: "100%", backgroundColor: "rgba(255,255,255,0.04)" }} />
                  <div className="skeleton" style={{ height: "4px", borderRadius: "999px", width: "60%", backgroundColor: "rgba(255,255,255,0.04)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ backgroundColor: "#0a0f0a", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="features-container">
          <div className="features-grid">
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 18h8"/><path d="M3 22h18"/>
                    <path d="M14 22a7 7 0 1 0 0-14h-1"/>
                    <path d="M9 14h2"/>
                    <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/>
                    <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
                  </svg>
                ),
                title: "Instant Diagnosis",
                body: "Snap a leaf and our on-device model returns a disease name with confidence scoring in under a second.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                    <path d="M11 13v-2l-2 4h4l-2 4"/>
                  </svg>
                ),
                title: "Weather Risk",
                body: "Local forecast data is fused with pathogen models to predict how fast an outbreak is likely to spread.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                    <path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
                  </svg>
                ),
                title: "Treatment Protocol",
                body: "Get a clear, step-by-step treatment plan with dosages and timing tailored to the detected disease.",
              },
            ].map((card) => (
              <div
                key={card.title}
                style={{
                  borderRadius: "16px", padding: "28px",
                  backgroundColor: "#0f1a0f",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", flexDirection: "column", gap: "20px",
                }}
              >
                <div
                  style={{
                    width: "44px", height: "44px", borderRadius: "10px",
                    backgroundColor: "#162116",
                    border: "1px solid rgba(74,222,128,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {card.icon}
                </div>
                <div>
                  <h3
                    className="font-display"
                    style={{ fontSize: "18px", fontStyle: "normal", fontWeight: 700, color: "#ffffff", marginBottom: "10px" }}
                  >
                    {card.title}
                  </h3>
                  <p style={{ fontSize: "14px", lineHeight: 1.65, color: "rgba(255,255,255,0.55)" }}>
                    {card.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}