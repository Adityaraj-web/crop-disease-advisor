'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Leaf, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error: sbError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (sbError) {
      setError(sbError.message)
      setLoading(false)
      return
    }

    // Supabase sends a confirmation email by default
    // Show success state instead of redirecting immediately
    setSuccess(true)
    setLoading(false)
  }

  // Success state — waiting for email confirmation
  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0f0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'rgba(74,222,128,0.1)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            border: '1px solid rgba(74,222,128,0.2)',
          }}>
            <CheckCircle size={28} color="#4ade80" />
          </div>
          <h2 className="font-display" style={{
            fontSize: '24px', fontWeight: 700,
            color: '#ffffff', margin: '0 0 12px',
          }}>
            Check your email
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '14px', lineHeight: '1.6',
            margin: '0 0 32px',
          }}>
            We sent a confirmation link to <span style={{ color: '#ffffff' }}>{email}</span>.
            Click it to activate your account.
          </p>
          <button
            onClick={() => router.push('/login')}
            style={{
              background: '#166534',
              border: 'none', borderRadius: '8px',
              padding: '12px 32px',
              color: '#4ade80', fontSize: '14px',
              fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Go to login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0f0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '48px', height: '48px',
            background: '#166534',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Leaf size={24} color="#4ade80" />
          </div>
          <h1 className="font-display" style={{
            fontSize: '28px', fontWeight: 700,
            color: '#ffffff', margin: '0 0 8px',
          }}>
            Create account
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', margin: 0 }}>
            Save your scan history across sessions
          </p>
        </div>

        {/* Card */}
        <div className="surface-raised" style={{ padding: '32px' }}>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '24px',
            }}>
              <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
              <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label className="label-instrument" style={{ display: 'block', marginBottom: '8px' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={15}
                color="rgba(255,255,255,0.35)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  background: '#162116',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  padding: '11px 14px 11px 40px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '16px' }}>
            <label className="label-instrument" style={{ display: 'block', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={15}
                color="rgba(255,255,255,0.35)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: '#162116',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  padding: '11px 14px 11px 40px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '24px' }}>
            <label className="label-instrument" style={{ display: 'block', marginBottom: '8px' }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={15}
                color="rgba(255,255,255,0.35)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: '#162116',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  padding: '11px 14px 11px 40px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSignup}
            disabled={loading || !email || !password || !confirmPassword}
            style={{
              width: '100%',
              background: loading || !email || !password || !confirmPassword
                ? 'rgba(22,101,52,0.5)' : '#166534',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              color: loading || !email || !password || !confirmPassword
                ? 'rgba(74,222,128,0.4)' : '#4ade80',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading || !email || !password || !confirmPassword
                ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </div>

        {/* Footer link */}
        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          color: 'rgba(255,255,255,0.35)',
          fontSize: '14px',
        }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#4ade80', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}