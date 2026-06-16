import { Leaf, AlertTriangle, Clock, Trash2 } from 'lucide-react'
import type { ScanRecord } from '@/hooks/useScanHistory'

interface ScanHistoryTableProps {
  scans: ScanRecord[]
  onDelete?: (id: string) => void
}

export function ScanHistoryTable({ scans, onDelete }: ScanHistoryTableProps) {
  if (scans.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '48px 24px',
        color: 'rgba(255,255,255,0.35)',
      }}>
        <Leaf size={32} color="rgba(74,222,128,0.3)" style={{ margin: '0 auto 16px' }} />
        <p style={{ margin: '0 0 8px', fontSize: '15px', color: 'rgba(255,255,255,0.55)' }}>
          No scans yet
        </p>
        <p style={{ margin: 0, fontSize: '13px' }}>
          Upload a crop photo to get started
        </p>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
      }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {['Status', 'Crop', 'Disease', 'Confidence', 'Date', ''].map(header => (
              <th key={header} style={{
                padding: '10px 16px',
                textAlign: 'left',
                color: 'rgba(255,255,255,0.35)',
                fontWeight: 400,
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                whiteSpace: 'nowrap',
              }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scans.map((scan, i) => {
            const date = new Date(scan.created_at)
            const formattedDate = date.toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })
            const formattedTime = date.toLocaleTimeString('en-IN', {
              hour: '2-digit', minute: '2-digit',
            })
            const confidencePct = Math.round(scan.confidence * 100)
            const [crop, disease] = scan.disease_label.includes(':')
              ? scan.disease_label.split(':').map((s: string) => s.trim())
              : [scan.disease_label, '—']

            return (
              <tr
                key={scan.id}
                style={{
                  borderBottom: i < scans.length - 1
                    ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLTableRowElement).style.background = '#162116'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'
                }}
              >
                {/* Status */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: scan.is_healthy
                      ? 'rgba(74,222,128,0.1)' : 'rgba(245,158,11,0.1)',
                    border: `1px solid ${scan.is_healthy
                      ? 'rgba(74,222,128,0.2)' : 'rgba(245,158,11,0.2)'}`,
                    borderRadius: '20px',
                    padding: '3px 10px',
                  }}>
                    {scan.is_healthy
                      ? <Leaf size={11} color="#4ade80" />
                      : <AlertTriangle size={11} color="#f59e0b" />
                    }
                    <span style={{
                      color: scan.is_healthy ? '#4ade80' : '#f59e0b',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}>
                      {scan.is_healthy ? 'Healthy' : 'Disease'}
                    </span>
                  </div>
                </td>

                {/* Crop */}
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.75)' }}>
                  {crop}
                </td>

                {/* Disease */}
                <td style={{
                  padding: '14px 16px',
                  color: scan.is_healthy ? 'rgba(255,255,255,0.35)' : '#f59e0b',
                  fontWeight: scan.is_healthy ? 400 : 500,
                }}>
                  {disease}
                </td>

                {/* Confidence */}
                <td style={{ padding: '14px 16px' }}>
                  <span className="font-mono-data" style={{
                    color: confidencePct >= 80 ? '#4ade80'
                      : confidencePct >= 60 ? '#f59e0b' : '#ef4444',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}>
                    {confidencePct}%
                  </span>
                </td>

                {/* Date */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <Clock size={11} color="rgba(255,255,255,0.35)" />
                    <span className="font-mono-data" style={{
                      color: 'rgba(255,255,255,0.35)',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                    }}>
                      {formattedDate} · {formattedTime}
                    </span>
                  </div>
                </td>

                {/* Delete */}
                <td style={{ padding: '14px 16px' }}>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(scan.id)}
                      style={{
                        background: 'none',
                        border: '1px solid transparent',
                        borderRadius: '6px',
                        padding: '6px',
                        cursor: 'pointer',
                        color: 'rgba(255,255,255,0.20)',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => {
                        const btn = e.currentTarget
                        btn.style.color = '#ef4444'
                        btn.style.borderColor = 'rgba(239,68,68,0.3)'
                        btn.style.background = 'rgba(239,68,68,0.1)'
                      }}
                      onMouseLeave={e => {
                        const btn = e.currentTarget
                        btn.style.color = 'rgba(255,255,255,0.20)'
                        btn.style.borderColor = 'transparent'
                        btn.style.background = 'none'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}