import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'

async function getSettings() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${base}/api/settings`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: settings?.siteTitle || 'Toko Kita',
    description: settings?.description || 'Produk terbaik dengan harga terjangkau',
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navbar settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  )
}
