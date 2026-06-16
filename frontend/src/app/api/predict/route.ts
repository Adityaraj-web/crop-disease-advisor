import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Missing file field in form data" },
        { status: 400 }
      );
    }

    const upstream = new FormData();
    upstream.append("file", file);

    const response = await fetch(`${BACKEND_URL}/predict/`, {
      method: "POST",
      body: upstream,
    });

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
    console.error("[/api/predict]", err);
    return NextResponse.json(
      { error: "Failed to reach backend. Is FastAPI running on port 8000?" },
      { status: 502 }
    );
  }
}