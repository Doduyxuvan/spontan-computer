'use client'

import { useState, useEffect } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'

interface Testimonial { _id: string; name: string; message: string; rating: number; image?: string }
interface FormData { name: string; message: string; rating: string; image: string }

const emptyForm: FormData = { name: '', message: '', rating: '5', image: '' }

const inputStyle = {
  width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)',
  borderRadius: 10, fontSize: '0.9rem', color: 'var(--text)', background: 'var(--bg)', outline: 'none',
}

export default function AdminTestimonialsPage() {
  const [list, setList] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchAll = () => {
    fetch('/api/testimonials').then(r => r.json()).then(data => { setList(data); setLoading(false) }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchAll() }, [])

  function openAdd() { setEditId(null); setForm(emptyForm); setModalOpen(true) }
  function openEdit(t: Testimonial) {
    setEditId(t._id)
    setForm({ name: t.name, message: t.message, rating: String(t.rating), image: t.image || '' })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.name || !form.message) return
    setSaving(true)
    const body = { ...form, rating: Number(form.rating) }
    try {
      const url = editId ? `/api/testimonials/${editId}` : '/api/testimonials'
      const method = editId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { setModalOpen(false); fetchAll() }
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Hapus testimoni dari "${name}"?`)) return
    await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Testimoni" />
      <div style={{ padding: '24px 32px' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <button
            onClick={openAdd}
            style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
          >
            + Tambah Testimoni
          </button>
        </div>

        {/* Tabel */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {loading ? (
            <div className="text-center" style={{ padding: 40, color: 'var(--text-muted)' }}>Memuat...</div>
          ) : list.length === 0 ? (
            <div className="text-center" style={{ padding: 40, color: 'var(--text-muted)' }}>Belum ada testimoni.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
                    {['Nama', 'Pesan', 'Rating', 'Aksi'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {list.map(t => (
                    <tr key={t._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>{t.name}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)', maxWidth: 300 }}>
                        <span title={t.message}>
                          {t.message.length > 60 ? t.message.slice(0, 60) + '...' : t.message}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#FBBF24', whiteSpace: 'nowrap' }}>
                        {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => openEdit(t)} style={{ padding: '6px 14px', background: '#EFF6FF', color: '#3B82F6', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                          <button onClick={() => handleDelete(t._id, t.name)} style={{ padding: '6px 14px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 20 }}
          onClick={e => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 500 }}>
            <h2 className="font-bold" style={{ fontSize: '1.1rem', marginBottom: 24 }}>{editId ? 'Edit Testimoni' : 'Tambah Testimoni'}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="block font-semibold text-sm" style={{ marginBottom: 6 }}>Nama Pelanggan *</label>
                <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nama pelanggan" />
              </div>
              <div>
                <label className="block font-semibold text-sm" style={{ marginBottom: 6 }}>Pesan / Review *</label>
                <textarea style={{ ...inputStyle, minHeight: 96, resize: 'vertical' }} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Isi review..." />
              </div>
              <div>
                <label className="block font-semibold text-sm" style={{ marginBottom: 6 }}>Rating</label>
                <select style={inputStyle} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}>
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'★'.repeat(n)} ({n})</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-sm" style={{ marginBottom: 6 }}>URL Foto (opsional)</label>
                <input style={inputStyle} value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '12px', background: 'var(--bg-2)', color: 'var(--text)', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>Batal</button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
