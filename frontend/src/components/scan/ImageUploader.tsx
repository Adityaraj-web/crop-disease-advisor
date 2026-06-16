"use client";

import { useCallback, useRef } from "react";
import type { ScanState } from "@/hooks/useDetection";

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  previewUrl: string | null;
  isLoading: boolean;
  currentState: ScanState;
  onReset: () => void;
}

export function ImageUploader({
  onFileSelect,
  previewUrl,
  isLoading,
  currentState,
  onReset,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      // reset input so same file can be re-selected
      e.target.value = "";
    },
    [handleFile]
  );

  const hasImage = !!previewUrl;

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        minHeight: "520px",
        backgroundColor: "#0d1a0d",
        border: hasImage
          ? "1px solid rgba(74,222,128,0.15)"
          : "1px solid rgba(255,255,255,0.08)",
      }}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* ── Empty state ── */}
      {!hasImage && (
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: "12px", background: "transparent",
            cursor: "pointer",
          }}
        >
          {/* Dashed border overlay via SVG */}
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: "16px", pointerEvents: "none" }}
          >
            <rect
              x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)"
              rx="15" ry="15" fill="none"
              stroke="rgba(74,222,128,0.25)" strokeWidth="1" strokeDasharray="8 6"
            />
          </svg>

          <div
            style={{
              width: "56px", height: "56px", borderRadius: "50%",
              backgroundColor: "rgba(22,101,52,0.2)",
              border: "1px solid rgba(74,222,128,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "8px",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
          </div>

          <p style={{ color: "#ffffff", fontSize: "18px", fontWeight: 600 }}>
            Drop a leaf image
          </p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px" }}>
            or tap to browse
          </p>
        </button>
      )}

      {/* ── Image preview ── */}
      {hasImage && (
        <>
          <img
            src={previewUrl!}
            alt="Leaf preview"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%", objectFit: "cover",
            }}
          />

          {/* Base dark overlay — lightens on hover via CSS group */}
          <div
            className="image-overlay"
            style={{
              position: "absolute", inset: 0,
              backgroundColor: isLoading ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.15)",
              transition: "background-color 0.2s",
            }}
          />

          {/* Loading state */}
          {isLoading && (
            <div
              style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "12px",
              }}
            >
              <div
                className="animate-spin"
                style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  border: "2px solid rgba(74,222,128,0.2)",
                  borderTopColor: "#4ade80",
                }}
              />
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", fontWeight: 500 }}>
                {currentState === "uploading" ? "Loading image…" : "Running model…"}
              </p>
            </div>
          )}

          {/* Hover replace overlay — uses CSS :hover on the wrapping group */}
          {!isLoading && (
            <label
              htmlFor="leaf-file-input-replace"
              style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "8px",
                backgroundColor: "rgba(0,0,0,0)",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(0,0,0,0.45)";
                const children = (e.currentTarget as HTMLElement).querySelectorAll(".replace-content");
                children.forEach((el) => ((el as HTMLElement).style.opacity = "1"));
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(0,0,0,0)";
                const children = (e.currentTarget as HTMLElement).querySelectorAll(".replace-content");
                children.forEach((el) => ((el as HTMLElement).style.opacity = "0"));
              }}
            >
              <svg className="replace-content" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0 , transition: "opacity 0.2s" }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span className="replace-content" style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", fontWeight: 500, opacity: 0, transition: "opacity 0.2s" }}>
                Click to replace
              </span>
              <input
                id="leaf-file-input-replace"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleInputChange}
              />
            </label>
          )}

          {/* Reset X — top right */}
          {!isLoading && (
            <button
              onClick={(e) => { e.stopPropagation(); onReset(); }}
              style={{
                position: "absolute", top: "12px", right: "12px",
                width: "32px", height: "32px", borderRadius: "50%",
                backgroundColor: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", zIndex: 10,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          )}
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleInputChange}
      />
    </div>
  );
}