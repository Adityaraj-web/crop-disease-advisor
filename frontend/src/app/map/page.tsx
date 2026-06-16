"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/shared/Navbar";
import { MapPin } from "lucide-react";
import { PageWrapper } from "@/components/shared/PageWrapper";

// Leaflet uses browser APIs (window, document) — must be client-side only
// ssr: false prevents Next.js from trying to render it on the server
const OutbreakMap = dynamic(() => import("@/components/map/OutbreakMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 480,
        background: "#0f1a0f",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="skeleton" style={{ width: "100%", height: "100%", borderRadius: 12 }} />
    </div>
  ),
});

export default function MapPage() {
  return (
    <PageWrapper>
      <style>{`
        .map-root {
          min-height: 100vh;
          background: #0a0f0a;
          color: #ffffff;
        }
        .map-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 80px 24px 80px;
        }
        .map-heading {
          font-size: 26px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 4px;
          letter-spacing: -0.02em;
        }
        .map-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          margin: 0 0 12px;
        }
        .map-notice {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.55);
          margin-bottom: 28px;
          font-family: var(--font-geist-mono, monospace);
        }

        /* Override Leaflet's default white tile background to reduce flash */
        .leaflet-container {
          background: #162116 !important;
        }

        @media (max-width: 767px) {
          .map-inner {
            padding: 80px 16px 64px;
          }
          .map-heading {
            font-size: 22px;
          }
        }
      `}</style>

      <div className="map-root">
        <div className="top-accent-bar" />
        <Navbar />

        <div className="map-inner">
          <h1 className="map-heading font-display">Disease Outbreak Map</h1>
          <p className="map-sub">
            Anonymously reported crop disease detections across India
          </p>
          <div className="map-notice">
            <MapPin size={12} style={{ color: "#4ade80", flexShrink: 0 }} />
            <span>
              All reports are anonymous — no personal data is stored or displayed
            </span>
          </div>

          <OutbreakMap />
        </div>
      </div>
    </ PageWrapper>
  );
}