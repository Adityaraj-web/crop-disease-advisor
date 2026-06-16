import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Uses the anon key — SELECT is public via RLS policy
// No auth required for reading the outbreak map
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("outbreak_reports")
      .select("id, disease_label, lat, lon, created_at")
      .order("created_at", { ascending: false })
      .limit(500); // safety cap — more than enough for a demo

    if (error) {
      console.error("[map-data] Supabase error:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch outbreak data" },
        { status: 500 }
      );
    }

    return NextResponse.json({ reports: data ?? [] });
  } catch (err) {
    console.error("[map-data] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}