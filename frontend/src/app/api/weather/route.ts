import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Required query params: lat, lon" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/weather?lat=${lat}&lon=${lon}`,
      { method: "GET" }
    );

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `Backend error: ${response.status}`, detail: text },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/weather]", err);
    return NextResponse.json(
      { error: "Failed to reach backend. Is FastAPI running on port 8000?" },
      { status: 502 }
    );
  }
}