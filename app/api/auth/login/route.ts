import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/db'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Auto-seed admin default jika belum ada
    const { count } = await supabase
      .from('admins')
      .select('*', { count: 'exact', head: true })

    if (count === 0) {
      const hashed = await bcrypt.hash('admin123', 10)
      await supabase.from('admins').insert({ email: 'admin@toko.com', password: hashed })
    }

    const { data: admin } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single()

    if (!admin) return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })

    const token = signToken({ id: admin.id, email: admin.email })
    const res = NextResponse.json({ success: true })
    res.cookies.set('admin-token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/' })
    return res
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}