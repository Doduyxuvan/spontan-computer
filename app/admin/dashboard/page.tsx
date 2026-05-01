import AdminHeader from '@/components/admin/AdminHeader'
import { getAdminSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function getStats() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const [products, categories, testimonials] = await Promise.all([
    fetch(`${base}/api/products`, { cache: 'no-store' }).then(r => r.json()).catch(() => []),
    fetch(`${base}/api/categories`, { cache: 'no-store' }).then(r => r.json()).catch(() => []),
    fetch(`${base}/api/testimonials`, { cache: 'no-store' }).then(r => r.json()).catch(() => []),
  ])
  return {
    products: Array.isArray(products) ? products.length : 0,
    categories: Array.isArray(categories) ? categories.length : 0,
    testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
  }
}

const statCards = (stats: { products: number; categories: number; testimonials: number }) => [
  { icon: '📦', label: 'Total Produk', value: stats.products, color: '#3B82F6', bg: '#EFF6FF', href: '/admin/products' },
  { icon: '🏷️', label: 'Total Kategori', value: stats.categories, color: '#8B5CF6', bg: '#F5F3FF', href: '/admin/categories' },
  { icon: '💬', label: 'Total Testimoni', value: stats.testimonials, color: '#F59E0B', bg: '#FFFBEB', href: '/admin/testimonials' },
  { icon: '✅', label: 'Status Website', value: 'Aktif', color: '#10B981', bg: '#ECFDF5', href: '/admin/settings' },
]

const menuShortcuts = [
  { href: '/admin/products', icon: '📦', label: 'Kelola Produk', desc: 'Tambah, edit, hapus produk' },
  { href: '/admin/categories', icon: '🏷️', label: 'Kelola Kategori', desc: 'Atur kategori produk' },
  { href: '/admin/testimonials', icon: '💬', label: 'Kelola Testimoni', desc: 'Kelola ulasan pelanggan' },
  { href: '/admin/settings', icon: '⚙️', label: 'Pengaturan', desc: 'Konfigurasi toko' },
]

export default async function DashboardPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')

  const stats = await getStats()
  const cards = statCards(stats)

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Dashboard" email={session.email} />

      <div style={{ padding: '32px 32px' }}>
        {/* Selamat datang */}
        <div style={{ marginBottom: 32 }}>
          <h2 className="font-bold" style={{ fontSize: '1.3rem', color: 'var(--text)', marginBottom: 4 }}>
            Selamat datang, {session.email} 👋
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Berikut ringkasan data toko Anda saat ini.
          </p>
        </div>

        {/* Stat cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 20,
            marginBottom: 40,
          }}
        >
          {cards.map(card => (
            <Link
              key={card.label}
              href={card.href}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: 24,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: card.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    marginBottom: 16,
                  }}
                >
                  {card.icon}
                </div>
                <p
                  className="font-bold"
                  style={{ fontSize: '1.8rem', color: card.color, marginBottom: 4 }}
                >
                  {card.value}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
                  {card.label}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Shortcut menu */}
        <h3 className="font-bold" style={{ fontSize: '1rem', marginBottom: 16, color: 'var(--text)' }}>
          Menu Cepat
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {menuShortcuts.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '16px 20px',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 24 }}>{item.icon}</span>
              <div>
                <p className="font-semibold" style={{ fontSize: '0.9rem', color: 'var(--text)', marginBottom: 2 }}>{item.label}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
