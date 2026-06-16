"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const isScanPage = pathname === "/scan";

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  if (isScanPage) {
    return (
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: "56px", display: "flex", alignItems: "center",
        padding: "0 20px",
        backgroundColor: "#0a0f0a",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <style>{`
          .scan-nav-links {
            display: flex; align-items: center;
            gap: 4px; flex: 1; justify-content: center;
          }
          .scan-version-badge {
            display: flex; align-items: center; gap: 8px;
            padding: 6px 14px; border-radius: 999px;
            background-color: #162116;
            border: 1px solid rgba(74,222,128,0.15);
          }
          @media (max-width: 767px) {
            .scan-nav-links { display: none; }
            .scan-version-badge { display: none; }
          }
        `}</style>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "40px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
            backgroundColor: "#162116", border: "1px solid rgba(74,222,128,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff", lineHeight: 1 }}>CropSense</p>
            <p className="label-instrument" style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>Diagnostic Engine</p>
          </div>
        </div>

        {/* Center nav */}
        <nav className="scan-nav-links">
          {[
            { label: "Diagnose", href: "/scan", active: true },
            { label: "History", href: "/dashboard", active: false },
            { label: "Map", href: "/map", active: false },
          ].map((item) => (
            <Link key={item.label} href={item.href} style={{
              padding: "6px 16px", borderRadius: "6px",
              fontSize: "11px", fontWeight: 500,
              letterSpacing: "0.05em", textTransform: "uppercase" as const,
              color: item.active ? "#4ade80" : "rgba(255,255,255,0.4)",
              textDecoration: "none", position: "relative" as const,
            }}>
              {item.label}
              {item.active && (
                <span style={{
                  display: "block", margin: "2px auto 0",
                  height: "1px", width: "16px", borderRadius: "999px",
                  backgroundColor: "#4ade80",
                }} />
              )}
            </Link>
          ))}
        </nav>

        {/* Version badge */}
        <div className="scan-version-badge">
          <span style={{
            height: "6px", width: "6px", borderRadius: "50%",
            backgroundColor: "#4ade80", boxShadow: "0 0 6px #4ade80",
          }} />
          <span className="font-mono-data" style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>
            V2.4 · ONLINE
          </span>
        </div>
      </header>
    );
  }

  // Landing navbar
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      height: "56px", display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 48px",
      backgroundColor: "rgba(10,15,10,0.9)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <style>{`
        .landing-nav-links {
          display: flex; align-items: center; gap: 8px;
        }
        .landing-nav-text { display: inline; }
        @media (max-width: 639px) {
          .landing-header { padding: 0 20px !important; }
          .landing-nav-text { display: none; }
        }
      `}</style>

      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        </svg>
        <span style={{ fontSize: "15px", fontWeight: 600, color: "#ffffff" }}>CropSense</span>
      </Link>

      <nav className="landing-nav-links">
        {/* Dashboard — always visible */}
        <Link href="/dashboard" className="landing-nav-text" style={{
          padding: "8px 16px", borderRadius: "8px",
          fontSize: "15px", color: "rgba(255,255,255,0.8)",
          textDecoration: "none",
        }}>
          Dashboard
        </Link>

        <Link href="/map" className="landing-nav-text" style={{
          padding: "8px 16px", borderRadius: "8px",
          fontSize: "15px", color: "rgba(255,255,255,0.8)",
          textDecoration: "none",
        }}>
          Outbreak Map
        </Link>

        {/* Auth section */}
        {!loading && (
          <>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span className="landing-nav-text" style={{
                  fontSize: "13px", color: "rgba(255,255,255,0.45)",
                  maxWidth: "180px", overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="landing-nav-text"
                  style={{
                    padding: "8px 16px", borderRadius: "8px",
                    fontSize: "15px", color: "rgba(255,255,255,0.8)",
                    background: "none", border: "none",
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login?redirectTo=/"
                className="landing-nav-text"
                style={{
                  padding: "8px 16px", borderRadius: "8px",
                  fontSize: "15px", color: "rgba(255,255,255,0.8)",
                  textDecoration: "none",
                }}
              >
                Sign In
              </Link>
            )}
          </>
        )}

        {/* Start Scanning — always visible */}
        <Link href="/scan" style={{
          padding: "5px 22px", borderRadius: "10px",
          backgroundColor: "#166534", color: "#ffffff",
          fontSize: "15px", fontWeight: 600, textDecoration: "none",
          border: "1px solid rgba(74,222,128,0.2)",
        }}>
          Start Scanning
        </Link>
      </nav>
    </header>
  );
}