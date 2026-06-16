"use client";

import { useMemo } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { ScanHistoryTable } from "@/components/dashboard/ScanHistoryTable";
import { ScanCard } from "@/components/dashboard/ScanCard";
import { useAuth } from "@/hooks/useAuth";
import { useScanHistory } from "@/hooks/useScanHistory";
import { PageWrapper } from "@/components/shared/PageWrapper";
import {
  ScanLine,
  AlertTriangle,
  Leaf,
  Clock,
} from "lucide-react";

// ─── Skeleton for stat cards ────────────────────────────────────────────────
function StatCardSkeleton() {
  return (
    <div className="surface-raised" style={{ padding: "20px 24px", borderRadius: 12 }}>
      <div className="skeleton" style={{ width: 80, height: 11, borderRadius: 4, marginBottom: 14 }} />
      <div className="skeleton" style={{ width: 48, height: 28, borderRadius: 6, marginBottom: 6 }} />
      <div className="skeleton" style={{ width: 120, height: 11, borderRadius: 4 }} />
    </div>
  );
}

// ─── Skeleton for history rows ───────────────────────────────────────────────
function HistorySkeletonDesktop() {
  return (
    <div className="surface-raised" style={{ borderRadius: 12, overflow: "hidden" }}>
      {/* faux table header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "90px 1fr 1fr 100px 140px 48px",
          gap: 12,
          padding: "14px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {["Status", "Crop", "Disease", "Confidence", "Date", ""].map((col, i) => (
          <div key={i} className="skeleton" style={{ height: 11, borderRadius: 4, width: col ? "60%" : 24 }} />
        ))}
      </div>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "90px 1fr 1fr 100px 140px 48px",
            gap: 12,
            padding: "16px 20px",
            borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
            alignItems: "center",
          }}
        >
          <div className="skeleton" style={{ height: 24, borderRadius: 999, width: 70 }} />
          <div className="skeleton" style={{ height: 13, borderRadius: 4, width: "55%" }} />
          <div className="skeleton" style={{ height: 13, borderRadius: 4, width: "70%" }} />
          <div className="skeleton" style={{ height: 20, borderRadius: 999, width: 52 }} />
          <div className="skeleton" style={{ height: 13, borderRadius: 4, width: "80%" }} />
          <div className="skeleton" style={{ height: 28, width: 28, borderRadius: 6 }} />
        </div>
      ))}
    </div>
  );
}

function HistorySkeletonMobile() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="surface-raised" style={{ padding: "16px 18px", borderRadius: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div className="skeleton" style={{ height: 24, width: 24, borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 28, width: 28, borderRadius: 6 }} />
          </div>
          <div className="skeleton" style={{ height: 15, width: "60%", borderRadius: 4, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 12, width: "40%", borderRadius: 4, marginBottom: 12 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="skeleton" style={{ height: 20, width: 52, borderRadius: 999 }} />
            <div className="skeleton" style={{ height: 11, width: 80, borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accentColor?: string;
}

function StatCard({ icon, label, value, sub, accentColor = "#4ade80" }: StatCardProps) {
  return (
    <div
      className="surface-raised"
      style={{
        padding: "20px 24px",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* subtle top-left accent glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 60,
          height: 60,
          background: `radial-gradient(circle at top left, ${accentColor}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ color: accentColor, display: "flex", alignItems: "center" }}>{icon}</div>
        <span className="label-instrument" style={{ color: "rgba(255,255,255,0.45)" }}>
          {label}
        </span>
      </div>
      <span
        className="font-mono-data"
        style={{ fontSize: 28, fontWeight: 600, color: "#ffffff", lineHeight: 1 }}
      >
        {value}
      </span>
      {sub && (
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
          {sub}
        </span>
      )}
    </div>
  );
}

// ─── Main Dashboard Page ─────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const { scans, loading, error, deleteScan } = useScanHistory(user);

  // Computed stats
  const stats = useMemo(() => {
    const total = scans.length;
    const diseaseCount = scans.filter((s) => !s.is_healthy).length;
    const healthyCount = scans.filter((s) => s.is_healthy).length;

    let recentLabel = "No scans yet";
    if (scans.length > 0) {
      const d = new Date(scans[0].created_at);
      recentLabel = d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    return { total, diseaseCount, healthyCount, recentLabel };
  }, [scans]);

  return (
    <PageWrapper>
      <style>{`
        .dashboard-root {
          min-height: 100vh;
          background: #0a0f0a;
          color: #ffffff;
        }
        .dashboard-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 80px 24px 80px;
        }
        .dashboard-heading {
          font-size: 26px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 4px;
          letter-spacing: -0.02em;
        }
        .dashboard-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.65);
          margin: 0 0 32px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 36px;
        }
        .history-section-label {
          font-size: 11px;
          font-family: var(--font-geist-mono, monospace);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(74,222,128,0.6);
          margin-bottom: 14px;
        }
        /* Desktop: show table, hide cards */
        .history-desktop { display: block; }
        .history-mobile  { display: none;  }

        @media (max-width: 767px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .dashboard-inner {
            padding: 28px 16px 64px;
          }
          .dashboard-heading {
            font-size: 22px;
          }
          /* Mobile: hide table, show cards */
          .history-desktop { display: none;  }
          .history-mobile  { display: block; }
        }

        @media (max-width: 400px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="dashboard-root">
        <div className="top-accent-bar" />
        <Navbar />

        <div className="dashboard-inner">
          {/* Page heading */}
          <h1 className="dashboard-heading font-display">Scan History</h1>
          <p className="dashboard-sub">
            Your crop disease detections and treatment records
          </p>

          {/* ── Stats row ── */}
          <div className="stats-grid">
            {loading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  icon={<ScanLine size={16} />}
                  label="Total Scans"
                  value={stats.total}
                  sub="all time"
                  accentColor="#4ade80"
                />
                <StatCard
                  icon={<AlertTriangle size={16} />}
                  label="Diseases Found"
                  value={stats.diseaseCount}
                  sub={
                    stats.total > 0
                      ? `${Math.round((stats.diseaseCount / stats.total) * 100)}% of scans`
                      : "—"
                  }
                  accentColor="#f59e0b"
                />
                <StatCard
                  icon={<Leaf size={16} />}
                  label="Healthy Crops"
                  value={stats.healthyCount}
                  sub={
                    stats.total > 0
                      ? `${Math.round((stats.healthyCount / stats.total) * 100)}% of scans`
                      : "—"
                  }
                  accentColor="#4ade80"
                />
                <StatCard
                  icon={<Clock size={16} />}
                  label="Last Scan"
                  value={
                    stats.recentLabel === "No scans yet"
                      ? "—"
                      : stats.recentLabel
                  }
                  sub={
                    stats.recentLabel === "No scans yet"
                      ? "No scans yet"
                      : "most recent"
                  }
                  accentColor="#4ade80"
                />
              </>
            )}
          </div>

          {/* ── Error state ── */}
          {error && !loading && (
            <div
              style={{
                padding: "16px 20px",
                borderRadius: 10,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#ef4444",
                fontSize: 14,
                marginBottom: 24,
              }}
            >
              Failed to load scan history. Please refresh the page.
            </div>
          )}

          {/* ── History section ── */}
          <div className="history-section-label label-instrument">
            Scan Records
          </div>

          {/* Desktop — table */}
          <div className="history-desktop">
            {loading ? (
              <HistorySkeletonDesktop />
            ) : (
              <ScanHistoryTable scans={scans} onDelete={deleteScan} />
            )}
          </div>

          {/* Mobile — card list */}
          <div className="history-mobile">
            {loading ? (
              <HistorySkeletonMobile />
            ) : scans.length === 0 ? (
              /* Empty state on mobile — mirrors ScanHistoryTable's own empty state */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "60px 24px",
                  gap: 12,
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                <Leaf size={32} style={{ opacity: 0.4 }} />
                <p style={{ fontSize: 14, margin: 0 }}>No scans yet</p>
                <p style={{ fontSize: 12, margin: 0, color: "rgba(255,255,255,0.25)" }}>
                  Upload a crop leaf photo on the Scan page to get started
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {scans.map((scan) => (
                  <ScanCard key={scan.id} scan={scan} onDelete={deleteScan} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ PageWrapper>
  );
}