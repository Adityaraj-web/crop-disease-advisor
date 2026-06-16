import { Leaf, AlertTriangle, Clock, TrendingUp } from 'lucide-react'
import type { ScanRecord } from '@/hooks/useScanHistory'

interface ScanCardProps {
  scan: ScanRecord
  onDelete?: (id: string) => void
}

export function ScanCard({ scan, onDelete }: ScanCardProps) {
  const date = new Date(scan.created_at)
  const formattedDate = date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const confidencePct = Math.round(scan.confidence * 100)

  // Extract crop and disease from label e.g. "Tomato: Late blight"
  const [crop, disease] = scan.disease_label.includes(':')
    ? scan.disease_label.split(':').map(s => s.trim())
    : [scan.disease_label, null]

  return (
    <div className="surface-raised" style={{
      padding: '16px',
      marginBottom: '12px',
      position: 'relative',
    }}>

      {/* Header row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '12px',
        gap: '12px',
      }}>
        {/* Icon + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div style={{
            width: '36px', height: '36px', flexShrink: 0,
            background: scan.is_healthy
              ? 'rgba(74,222,128,0.1)' : 'rgba(245,158,11,0.1)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${scan.is_healthy
              ? 'rgba(74,222,128,0.2)' : 'rgba(245,158,11,0.2)'}`,
          }}>
            {scan.is_healthy
              ? <Leaf size={16} color="#4ade80" />
              : <AlertTriangle size={16} color="#f59e0b" />
            }
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{
              color: scan.is_healthy ? '#4ade80' : '#f59e0b',
              fontSize: '13px',
              fontWeight: 600,
              margin: '0 0 2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {disease ?? crop}
            </p>
            <p style={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: '11px',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {disease ? crop : 'Unknown crop'}
            </p>
          </div>
        </div>

        {/* Confidence badge */}
        <div style={{
          background: '#162116',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '6px',
          padding: '4px 10px',
          flexShrink: 0,
        }}>
          <span className="font-mono-data" style={{
            color: confidencePct >= 80 ? '#4ade80'
              : confidencePct >= 60 ? '#f59e0b' : '#ef4444',
            fontSize: '13px',
            fontWeight: 600,
          }}>
            {confidencePct}%
          </span>
        </div>
      </div>

      {/* Footer row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={11} color="rgba(255,255,255,0.35)" />
          <span className="font-mono-data" style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '11px',
          }}>
            {formattedDate} · {formattedTime}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <TrendingUp size={11} color="rgba(255,255,255,0.35)" />
          <span style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '11px',
          }}>
            {scan.is_healthy ? 'Healthy' : 'Disease detected'}
          </span>
        </div>
      </div>

      {/* Delete button */}
      {onDelete && (
        <button
          onClick={() => onDelete(scan.id)}
          style={{
            position: 'absolute',
            top: '12px', right: '12px',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.20)',
            cursor: 'pointer',
            padding: '4px',
            fontSize: '16px',
            lineHeight: 1,
            display: 'none', // shown via CSS hover on parent
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}