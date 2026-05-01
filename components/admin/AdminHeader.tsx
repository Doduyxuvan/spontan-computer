'use client'

import { useRouter } from 'next/navigation'

interface AdminHeaderProps {
  title: string
  email?: string
}

export default function AdminHeader({ title, email }: AdminHeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <header
      className="flex items-center justify-between px-8 py-4 shrink-0"
      style={{
        background: '#fff',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <h1 className="font-bold text-lg" style={{ color: 'var(--text)' }}>
        {title}
      </h1>

      <div className="flex items-center gap-4">
        {email && (
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {email}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
          style={{ background: 'var(--bg-2)', color: 'var(--text)' }}
        >
          Logout
        </button>
      </div>
    </header>
  )
}
