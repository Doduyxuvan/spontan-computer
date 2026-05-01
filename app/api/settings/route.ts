import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data: existing } = await supabase.from('settings').select('id').single()

  let result
  if (!existing) {
    const { data, error } = await supabase.from('settings').insert(body).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    result = data
  } else {
    const { data, error } = await supabase
      .from('settings')
      .update({
        site_title: body.siteTitle,
        description: body.description,
        whatsapp_number: body.whatsappNumber,
        hero_image: body.heroImage,
        logo: body.logo,
        address: body.address,
        operational_hours: body.operationalHours,
      })
      .eq('id', existing.id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    result = data
  }

  return NextResponse.json(result)
}