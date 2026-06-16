import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surface layers — three distinct z-plane levels
        surface: {
          base: "#0a0f0a",      // page background
          raised: "#0f1a0f",    // cards, panels
          elevated: "#162116",  // confidence arc card, hover states
          border: "rgba(255,255,255,0.08)", // universal border
        },
        // Primary green — functional, not decorative
        green: {
          accent: "#4ade80",    // icons, active states, CTA text
          deep: "#166534",      // CTA button bg, borders
          muted: "#22c55e",     // arc gradient start
          dim: "rgba(74,222,128,0.12)", // glow backgrounds
        },
        // Amber — warnings, disease states, highlights
        amber: {
          accent: "#f59e0b",    // disease name, spread risk
          deep: "#92400e",      // amber border tint
          dim: "rgba(245,158,11,0.12)", // amber glow
        },
        // Red — critical severity only
        red: {
          accent: "#ef4444",
          dim: "rgba(239,68,68,0.12)",
        },
        // Text hierarchy
        text: {
          primary: "#ffffff",
          secondary: "rgba(255,255,255,0.55)",
          muted: "rgba(255,255,255,0.35)",
          disabled: "rgba(255,255,255,0.20)",
        },
      },

      fontFamily: {
        // Display: editorial serif for hero headlines only
        display: ["Fraunces", "Georgia", "serif"],
        // UI: clean sans for all interface text
        sans: ["Inter", "system-ui", "sans-serif"],
        // Data: monospace for all numeric readouts and labels
        mono: ["Geist Mono", "JetBrains Mono", "monospace"],
      },

      fontSize: {
        // Instrument label — uppercase tracking-widest
        "label-xs": ["0.6875rem", { lineHeight: "1", letterSpacing: "0.15em" }],
        "label-sm": ["0.75rem", { lineHeight: "1", letterSpacing: "0.12em" }],
        // Body
        "body-sm": ["0.8125rem", { lineHeight: "1.6" }],
        "body-md": ["0.9375rem", { lineHeight: "1.6" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        // UI headings
        "heading-sm": ["1rem", { lineHeight: "1.3", fontWeight: "600" }],
        "heading-md": ["1.25rem", { lineHeight: "1.3", fontWeight: "600" }],
        "heading-lg": ["1.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        // Display — Fraunces only
        "display-sm": ["2.25rem", { lineHeight: "1.1", fontWeight: "700" }],
        "display-md": ["3.5rem", { lineHeight: "1.05", fontWeight: "700" }],
        "display-lg": ["4.5rem", { lineHeight: "1.0", fontWeight: "700" }],
        // Monospace data readouts
        "mono-sm": ["0.75rem", { lineHeight: "1", fontWeight: "400" }],
        "mono-md": ["1rem", { lineHeight: "1", fontWeight: "500" }],
        "mono-lg": ["1.5rem", { lineHeight: "1", fontWeight: "600" }],
        "mono-xl": ["2.25rem", { lineHeight: "1", fontWeight: "700" }],
        "mono-2xl": ["3rem", { lineHeight: "1", fontWeight: "700" }],
      },

      borderRadius: {
        card: "12px",
        button: "8px",
        pill: "9999px",
        tile: "10px",
      },

      spacing: {
        // Consistent gap system
        "gap-xs": "8px",
        "gap-sm": "12px",
        "gap-md": "16px",
        "gap-lg": "24px",
        "gap-xl": "32px",
        "gap-2xl": "48px",
        "gap-3xl": "64px",
      },

      boxShadow: {
        // Green glow — phone mockup, upload zone hover
        "glow-green": "0 0 60px rgba(74,222,128,0.08)",
        "glow-green-md": "0 0 40px rgba(74,222,128,0.12)",
        // Diagnosis card elevation
        "card-elevated": "0 8px 32px rgba(0,0,0,0.4)",
        // Amber glow — spread risk, disease alerts
        "glow-amber": "0 0 40px rgba(245,158,11,0.10)",
      },

      backgroundImage: {
        // Subtle dot grid for landing page hero
        "dot-grid":
          "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
        // Radial green glow behind hero headline
        "hero-glow":
          "radial-gradient(ellipse 800px 600px at 30% 50%, rgba(22,101,52,0.15) 0%, transparent 70%)",
        // Arc gradient — confidence meter
        "arc-healthy": "conic-gradient(#22c55e, #4ade80)",
        "arc-warning": "conic-gradient(#f59e0b, #fbbf24)",
        "arc-danger": "conic-gradient(#ef4444, #f87171)",
      },

      backgroundSize: {
        "dot-grid": "40px 40px",
      },

      animation: {
        // Upload zone dash animation
        "dash-spin": "dash-spin 8s linear infinite",
        // Phone mockup float
        float: "float 4s ease-in-out infinite",
        // Process strip connector dot
        "dot-travel": "dot-travel 2.4s ease-in-out infinite",
        // Ticker marquee
        "marquee-ltr": "marquee-ltr 40s linear infinite",
        // Subtle pulse for awaiting state
        "pulse-dim": "pulse-dim 2s ease-in-out infinite",
        // Page top accent bar shimmer
        "bar-shimmer": "bar-shimmer 3s ease-in-out infinite",
      },

      keyframes: {
        "dash-spin": {
          "0%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "100" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "dot-travel": {
          "0%": { left: "0%", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { left: "100%", opacity: "0" },
        },
        "marquee-ltr": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-dim": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
        "bar-shimmer": {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
      },

      transitionTimingFunction: {
        // Smooth spring-like easing for panel reveals
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        // Smooth deceleration for slide-ups
        "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },

      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },

      screens: {
        xs: "390px",   // small mobile
        sm: "640px",
        md: "768px",   // tablet — single to two column breakpoint
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px", // desktop design baseline
      },

      zIndex: {
        navbar: "100",
        modal: "200",
        toast: "300",
      },
    },
  },
  plugins: [],
};

export default config;