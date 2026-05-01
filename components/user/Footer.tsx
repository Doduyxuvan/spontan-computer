import Link from 'next/link'

interface FooterProps {
  settings?: {
    siteTitle?: string
    description?: string
    whatsappNumber?: string
    address?: string
    operationalHours?: string
  } | null
}

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/products', label: 'Produk' },
  { href: '/testimonials', label: 'Testimoni' },
  { href: '/tentang', label: 'Tentang' },
]

export default function Footer({ settings }: FooterProps) {
  const phone = settings?.whatsappNumber?.replace(/\D/g, '') || ''
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--text)', color: '#fff' }}>
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--accent-light)' }}>
              {settings?.siteTitle || 'Toko Kita'}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {settings?.description || 'Produk terbaik dengan harga terjangkau.'}
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Navigasi
            </h4>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Kontak
            </h4>
            <ul className="flex flex-col gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {phone && (
                <li>
                  <a
                    href={`https://wa.me/${phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    📱 {settings?.whatsappNumber}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-2">
                  <span>📍</span>
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.operationalHours && (
                <li className="flex items-center gap-2">
                  <span>🕐</span>
                  <span>{settings.operationalHours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 text-center text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
        >
          © {year} {settings?.siteTitle || 'Toko Kita'}. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  )
}
