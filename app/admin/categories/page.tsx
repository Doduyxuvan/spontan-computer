'use client'

import { useState, useEffect } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'

interface Category { _id: string; name: string }

const inputStyle = {
  padding: '10px 14px', border: '1.5px solid var(--border)',
  borderRadius: 10, fontSize: '0.9rem', color: 'var(--text)', background: 'var(--bg)', outline: 'none',
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchCategories = () => {
    fetch('/api/categories').then(r => r.json()).then(data => {
      setCategories(data); setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => { fetchCategories() }, [])

  async function handleAdd() {
    if (!newName.trim()) return
    setAdding(true)
    try {
      const res = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName.trim() }) })
      if (res.ok) { setNewName(''); fetchCategories() }
    } finally { setAdding(false) }
  }

  async function handleEdit(id: string) {
    if (!editValue.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: editValue.trim() }) })
      if (res.ok) { setEditingId(null); fetchCategories() }
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Hapus kategori "${name}"?`)) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    fetchCategories()
  }

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Kategori" />
      <div style={{ padding: '24px 32px' }}>
        {/* Form tambah */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', padding: 24, marginBottom: 24 }}>
          <h3 className="font-bold" style={{ marginBottom: 16, fontSize: '0.95rem' }}>Tambah Kategori Baru</h3>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Nama kategori..."
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
            />
            <button
              onClick={handleAdd}
              disabled={adding || !newName.trim()}
              style={{ padding: '10px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              {adding ? '...' : '+ Tambah'}
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {loading ? (
            <div className="text-center" style={{ padding: 40, color: 'var(--text-muted)' }}>Memuat...</div>
          ) : categories.length === 0 ? (
            <div className="text-center" style={{ padding: 40, color: 'var(--text-muted)' }}>Belum ada kategori.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Nama Kategori</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 20px' }}>
                      {editingId === cat._id ? (
                        <input
                          style={{ ...inputStyle, width: '100%', maxWidth: 320 }}
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleEdit(cat._id); if (e.key === 'Escape') setEditingId(null) }}
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium" style={{ color: 'var(--text)' }}>{cat.name}</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                      {editingId === cat._id ? (
                        <div style={{ display: 'inline-flex', gap: 8 }}>
                          <button onClick={() => handleEdit(cat._id)} disabled={saving} style={{ padding: '6px 14px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>
                            {saving ? '...' : 'Simpan'}
                          </button>
                          <button onClick={() => setEditingId(null)} style={{ padding: '6px 14px', background: 'var(--bg-2)', color: 'var(--text)', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>Batal</button>
                        </div>
                      ) : (
                        <div style={{ display: 'inline-flex', gap: 8 }}>
                          <button onClick={() => { setEditingId(cat._id); setEditValue(cat.name) }} style={{ padding: '6px 14px', background: '#EFF6FF', color: '#3B82F6', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                          <button onClick={() => handleDelete(cat._id, cat.name)} style={{ padding: '6px 14px', background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>Hapus</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
