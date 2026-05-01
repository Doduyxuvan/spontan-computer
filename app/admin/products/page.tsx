'use client'

import { useState, useEffect } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'

interface Category { _id: string; name: string }
interface Product {
  _id: string; name: string; price: number; description?: string
  image?: string; categoryId?: { _id: string; name: string } | null; featured?: boolean
}
interface FormData { name: string; price: string; description: string; image: string; categoryId: string; featured: boolean }

const emptyForm: FormData = { name: '', price: '', description: '', image: '', categoryId: '', featured: false }

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)
}

const inputStyle = {
  width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)',
  borderRadius: 10, fontSize: '0.9rem', color: 'var(--text)', background: 'var(--bg)', outline: 'none',
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchAll = () => {
    setLoading(true)
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([p, c]) => {
      setProducts(p)
      setCategories(c)
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchAll() }, [])

  function openAdd() { setEditId(null); setForm(emptyForm); setModalOpen(true) }
  function openEdit(p: Product) {
    setEditId(p._id)
    setForm({
      name: p.name, price: String(p.price), description: p.description || '',
      image: p.image || '', categoryId: p.categoryId?._id || '', featured: p.featured || false,
    })
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.name || !form.price) return
    setSaving(true)
    const body = { ...form, price: Number(form.price), categoryId: form.categoryId || null }
    try {
      const url = editId ? `/api/products/${editId}` : '/api/products'
      const method = editId ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (res.ok) { setModalOpen(false); fetchAll() }
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Hapus produk "${name}"?`)) return
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Produk" />
      <div style={{ padding: '24px 32px' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <button
            onClick={openAdd}
            style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
          >
            + Tambah Produk
          </button>
        </div>

        {/* Tabel */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {loading ? (
            <div className="text-center" style={{ padding: 40, color: 'var(--text-muted)' }}>Memuat...</div>
          ) : products.length === 0 ? (
            <div className="text-center" style={{ padding: 40, color: 'var(--text-muted)' }}>Belum ada produk.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
                    {['Gambar', 'Nama', 'Kategori', 'Harga', 'Featured', 'Aksi'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--bg-2)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 20, opacity: 0.3 }}>📦</span>}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text)' }}>{p.name}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{p.categoryId?.name || '—'}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--accent)', fontWeight: 600 }}>{formatRupiah(p.price)}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: '0.78rem', fontWeight: 600, background: p.featured ? 'var(--accent-bg)' : 'var(--bg-2)', color: p.featured ? 'var(--accent)' : 'var(--text-muted)' }}>
                          {p.featured ? 'Ya' : 'Tidak'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => openEdit(p)} style={{ padding: '6px 14px', background: '#EFF6FF', color: '#3B82F6', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                          <button onClick={() => handleDelete(p._id, p.name)} style={{ padding: '6px 14px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>Hapus</button>
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
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 className="font-bold" style={{ fontSize: '1.1rem', marginBottom: 24 }}>{editId ? 'Edit Produk' : 'Tambah Produk'}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="block font-semibold text-sm" style={{ marginBottom: 6 }}>Nama Produk *</label>
                <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nama produk" />
              </div>
              <div>
                <label className="block font-semibold text-sm" style={{ marginBottom: 6 }}>Harga *</label>
                <input style={inputStyle} type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="50000" />
              </div>
              <div>
                <label className="block font-semibold text-sm" style={{ marginBottom: 6 }}>Deskripsi</label>
                <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Deskripsi produk..." />
              </div>
              <div>
                <label className="block font-semibold text-sm" style={{ marginBottom: 6 }}>URL Gambar</label>
                <input style={inputStyle} value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." />
                {form.image && (
                  <div style={{ marginTop: 10, borderRadius: 10, overflow: 'hidden', width: 100, height: 100, border: '1px solid var(--border)' }}>
                    <img src={form.image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                )}
              </div>
              <div>
                <label className="block font-semibold text-sm" style={{ marginBottom: 6 }}>Kategori</label>
                <select style={inputStyle} value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                  <option value="">— Pilih Kategori —</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                <label htmlFor="featured" className="font-semibold text-sm" style={{ cursor: 'pointer' }}>Tampilkan sebagai Produk Unggulan</label>
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
