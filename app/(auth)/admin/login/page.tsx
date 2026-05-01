'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        setError('Email atau password salah')
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1A1814 0%, #2D2A24 60%, #1A3028 100%)',
        padding: 20,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 24,
          padding: '40px 36px',
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <div className="text-center" style={{ marginBottom: 32 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 26,
            }}
          >
            🛒
          </div>
          <h1 className="font-bold" style={{ fontSize: '1.4rem', color: 'var(--text)', marginBottom: 6 }}>Admin Login</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Masuk ke panel admin toko</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label className="block font-semibold text-sm" style={{ marginBottom: 6, color: 'var(--text)' }}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@toko.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid var(--border)',
                borderRadius: 12,
                fontSize: '0.95rem',
                color: 'var(--text)',
                background: 'var(--bg)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="block font-semibold text-sm" style={{ marginBottom: 6, color: 'var(--text)' }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1.5px solid var(--border)',
                borderRadius: 12,
                fontSize: '0.95rem',
                color: 'var(--text)',
                background: 'var(--bg)',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 10,
                padding: '12px 16px',
                marginBottom: 20,
                color: '#DC2626',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? 'var(--accent-light)' : 'var(--accent)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: 'none',
              borderRadius: 12,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}
