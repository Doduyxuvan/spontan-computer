'use client'

import { useState, useEffect } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'

interface Settings {
  siteTitle: string; description: string; whatsappNumber: string
  address: string; operationalHours: string; logo: string; heroImage: string
}

const defaultSettings: Settings = {
  siteTitle: '', description: '', whatsappNumber: '',
  address: '', operationalHours: '', logo: '', heroImage: '',
}

const inputStyle = {
  width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)',
  borderRadius: 10, fontSize: '0.9rem', color: 'var(--text)', background: 'var(--bg)', outline: 'none',
}

function Section({ title }: { title: string }) {
  return (
    <div style={{ borderBottom: '2px solid var(--border)', paddingBottom: 4, marginBottom: 20, marginTop: 8 }}>
      <h3 className="font-bold uppercase text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>{title}</h3>
    </div>
  )
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      setForm({
        siteTitle: data.siteTitle || '',
        description: data.description || '',
        whatsappNumber: data.whatsappNumber || '',
        address: data.address || '',
        operationalHours: data.operationalHours || '',
        logo: data.logo || '',
        heroImage: data.heroImage || '',
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  function set(key: keyof Settings, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setToast('✅ Pengaturan berhasil disimpan!')
        setTimeout(() => setToast(''), 3000)
      } else {
        setToast('❌ Gagal menyimpan. Coba lagi.')
        setTimeout(() => setToast(''), 3000)
      }
    } finally { setSaving(false) }
  }

  if (loading) return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Pengaturan" />
      <div className="text-center" style={{ padding: 60, color: 'var(--text-muted)' }}>Memuat...</div>
    </div>
  )

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Pengaturan" />

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 100,
          padding: '14px 24px', borderRadius: 12, fontWeight: 600, fontSize: '0.9rem',
          background: toast.startsWith('✅') ? '#ECFDF5' : '#FEF2F2',
          color: toast.startsWith('✅') ? '#065F46' : '#991B1B',
          border: `1px solid ${toast.startsWith('✅') ? '#6EE7B7' : '#FECACA'}`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}>
          {toast}
        </div>
      )}

      <div style={{ padding: '24px 32px', maxWidth: 680 }}>
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--border)', padding: 32 }}>

          {/* INFORMASI UMUM */}
          <Section title="Informasi Umum" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            <div>
              <label className="block font-semibold text-sm" style={{ marginBottom: 6 }}>Judul Website</label>
              <input style={inputStyle} value={form.siteTitle} onChange={e => set('siteTitle', e.target.value)} placeholder="Toko Kita" />
            </div>
            <div>
              <label className="block font-semibold text-sm" style={{ marginBottom: 6 }}>Deskripsi Website</label>
              <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Deskripsi singkat tentang toko Anda..." />
            </div>
          </div>

          {/* KONTAK */}
          <Section title="Kontak" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            <div>
              <label className="block font-semibold text-sm" style={{ marginBottom: 6 }}>Nomor WhatsApp</label>
              <input style={inputStyle} value={form.whatsappNumber} onChange={e => set('whatsappNumber', e.target.value)} placeholder="628123456789" />
              {form.whatsappNumber && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6 }}>
                  Preview: <a href={`https://wa.me/${form.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>wa.me/{form.whatsappNumber.replace(/\D/g, '')}</a>
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold text-sm" style={{ marginBottom: 6 }}>Alamat</label>
              <input style={inputStyle} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Jl. Contoh No. 1, Jakarta" />
            </div>
            <div>
              <label className="block font-semibold text-sm" style={{ marginBottom: 6 }}>Jam Operasional</label>
              <input style={inputStyle} value={form.operationalHours} onChange={e => set('operationalHours', e.target.value)} placeholder="Senin–Sabtu 08.00–17.00 WIB" />
            </div>
          </div>

          {/* TAMPILAN */}
          <Section title="Tampilan" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
            <div>
              <label className="block font-semibold text-sm" style={{ marginBottom: 6 }}>URL Logo</label>
              <input style={inputStyle} value={form.logo} onChange={e => set('logo', e.target.value)} placeholder="https://..." />
              {form.logo && (
                <div style={{ marginTop: 10, borderRadius: 10, overflow: 'hidden', width: 120, height: 60, border: '1px solid var(--border)', background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={form.logo} alt="logo preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
            </div>
            <div>
              <label className="block font-semibold text-sm" style={{ marginBottom: 6 }}>URL Hero Image</label>
              <input style={inputStyle} value={form.heroImage} onChange={e => set('heroImage', e.target.value)} placeholder="https://..." />
              {form.heroImage && (
                <div style={{ marginTop: 10, borderRadius: 12, overflow: 'hidden', width: '100%', height: 120, border: '1px solid var(--border)', background: 'var(--bg-2)' }}>
                  <img src={form.heroImage} alt="hero preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
            </div>
          </div>

          {/* Tombol simpan */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ width: '100%', padding: '14px', background: saving ? 'var(--accent-light)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.95rem', cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </div>
    </div>
  )
}
