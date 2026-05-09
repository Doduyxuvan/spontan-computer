import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseServer'
import { getAdminSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  let query = supabase
    .from('products')
    .select('*, categories(id, name)')
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category_id', category)
  if (featured === 'true') query = query.eq('featured', true)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const { data: product, error } = await supabase
    .from('products')
    .insert({
      name: data.name,
      price: data.price,
      description: data.description || '',
      image: data.image || '',
      category_id: data.categoryId || null,
      featured: data.featured || false,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(product, { status: 201 })
}
