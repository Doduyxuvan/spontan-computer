'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/admin/products', label: 'Produk', icon: '📦' },
  { href: '/admin/categories', label: 'Kategori', icon: '🏷️' },
  { href: '/admin/testimonials', label: 'Testimoni', icon: '💬' },
  { href: '/admin/settings', label: 'Pengaturan', icon: '⚙️' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside
      className="w-56 min-h-screen flex flex-col shrink-0"
      style={{ background: '#1A1814', color: '#fff' }}
    >
      {/* Logo */}
      <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <span className="font-bold text-base" style={{ color: 'var(--accent-light)' }}>
          🛒 Admin Panel
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {menuItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: active ? 'rgba(82,183,136,0.15)' : 'transparent',
                color: active ? 'var(--accent-light)' : 'rgba(255,255,255,0.65)',
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  )
}
