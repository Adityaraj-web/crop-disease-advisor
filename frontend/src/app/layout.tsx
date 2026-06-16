import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Fraunces } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import { Navbar } from "@/components/shared/Navbar";
import "@/app/globals.css";

// Inter — UI body font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Fraunces — display/hero headlines, italic variable
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["italic"],
  weight: "variable",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CropSense — AI Crop Disease Detection",
    template: "%s | CropSense",
  },
  description:
    "Upload a leaf photo. Get an instant diagnosis with treatment protocols and weather-based spread risk — powered by local AI.",
  keywords: ["crop disease", "plant diagnosis", "AI", "agriculture", "PlantVillage"],
  authors: [{ name: "CropSense" }],
  openGraph: {
    title: "CropSense — AI Crop Disease Detection",
    description:
      "Upload a leaf photo. Get an instant diagnosis with treatment protocols and weather-based spread risk.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${fraunces.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[#0a0f0a] text-white antialiased overflow-x-hidden">
        <Navbar />
        <main>{children}</main>

        {/* Sonner toast provider */}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#0f1a0f",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#ffffff",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}