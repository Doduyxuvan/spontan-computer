'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import WAButton from './WAButton'

interface NavbarProps {
  settings?: {
    siteTitle?: string
    whatsappNumber?: string
    logo?: string
  } | null
}

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/products', label: 'Produk' },
  { href: '/testimonials', label: 'Testimoni' },
  { href: '/tentang', label: 'Tentang' },
]

export default function Navbar({ settings }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="container-main flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {settings?.logo ? (
            <img src={settings.logo} alt={settings.siteTitle || 'Logo'} className="h-8 w-auto" />
          ) : (
            <span className="font-bold text-xl" style={{ color: 'var(--accent)' }}>
              {settings?.siteTitle || 'Toko Kita'}
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: active ? 'var(--accent)' : 'var(--text)',
                  background: active ? 'var(--accent-bg)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* WA button */}
        <div className="hidden md:block">
          <WAButton phone={settings?.whatsappNumber || ''} label="Pesan WA" size="sm" />
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className="w-5 h-0.5 block transition-all" style={{ background: 'var(--text)' }} />
          <span className="w-5 h-0.5 block transition-all" style={{ background: 'var(--text)' }} />
          <span className="w-5 h-0.5 block transition-all" style={{ background: 'var(--text)' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-5 pb-4 flex flex-col gap-1" style={{ borderTop: '1px solid var(--border)' }}>
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium"
                style={{
                  color: active ? 'var(--accent)' : 'var(--text)',
                  background: active ? 'var(--accent-bg)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            )
          })}
          <div className="mt-2">
            <WAButton phone={settings?.whatsappNumber || ''} label="Pesan WA" size="sm" fullWidth />
          </div>
        </div>
      )}
    </header>
  )
}
