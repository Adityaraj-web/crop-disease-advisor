import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

// Service role client — bypasses RLS, used only for the anonymous outbreak insert
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { disease_label, confidence, lat, lon, target_lang } = body

    if (!disease_label || confidence === undefined) {
      return NextResponse.json(
        { error: 'disease_label and confidence are required' },
        { status: 400 }
      )
    }

    // Forward to FastAPI backend — include target_lang (defaults to "en" if absent)

    const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";
    const backendResponse = await fetch(`${BACKEND_URL}/advisory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        disease_label,
        confidence,
        lat,
        lon,
        target_lang: target_lang ?? 'en',
      }),
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      return NextResponse.json(
        { error: 'Backend error', details: errorText },
        { status: backendResponse.status }
      )
    }

    const advisoryData = await backendResponse.json()

    // --- SUPABASE SAVE (scan history) ---
    // Always saves the English advisory (base language) — we never save
    // translated versions to avoid storing duplicate rows per language
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        await supabase.from('scans').insert({
          user_id: user.id,
          disease_label: advisoryData.disease_label,
          confidence: advisoryData.confidence,
          is_healthy: advisoryData.disease_label?.toLowerCase().includes('healthy') ?? false,
          advisory_text: advisoryData.advisory_text ?? null,
          weather_json: advisoryData.weather ?? null,
          image_url: null,
        })
      }
    } catch {
      // Silent fail — scan save is best-effort, not critical path
    }
    // --- END SCAN HISTORY SAVE ---

    // --- OUTBREAK REPORT (anonymous) ---
    try {
      const isHealthy = advisoryData.disease_label?.toLowerCase().includes('healthy') ?? false
      if (lat && lon && advisoryData.disease_label && !isHealthy) {
        await supabaseAdmin.from('outbreak_reports').insert({
          disease_label: advisoryData.disease_label,
          lat: parseFloat(lat),
          lon: parseFloat(lon),
        })
      }
    } catch {
      // Silent fail — outbreak insert is best-effort
    }
    // --- END OUTBREAK REPORT ---

    return NextResponse.json(advisoryData)

  } catch (error) {
    console.error('Advisory route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}