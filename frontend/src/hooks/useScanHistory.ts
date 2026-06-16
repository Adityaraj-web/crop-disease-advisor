'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export type ScanRecord = {
  id: string
  user_id: string
  disease_label: string
  confidence: number
  is_healthy: boolean
  advisory_text: string | null
  weather_json: Record<string, unknown> | null
  image_url: string | null
  created_at: string
}

export function useScanHistory(user: User | null) {
  const [scans, setScans] = useState<ScanRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // No user — clear state and stop
    if (!user) {
      setScans([])
      setLoading(false)
      return
    }

    const fetchScans = async () => {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      const { data, error: sbError } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (sbError) {
        setError('Failed to load scan history')
        setLoading(false)
        return
      }

      setScans(data as ScanRecord[])
      setLoading(false)
    }

    fetchScans()
  }, [user])

  const deleteScan = async (scanId: string) => {
    const supabase = createClient()

    const { error: sbError } = await supabase
      .from('scans')
      .delete()
      .eq('id', scanId)

    if (!sbError) {
      // Optimistic update — remove from local state immediately
      setScans(prev => prev.filter(s => s.id !== scanId))
    }
  }

  return { scans, loading, error, deleteScan }
}